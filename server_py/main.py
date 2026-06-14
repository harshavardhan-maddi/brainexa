import os
import smtplib
import secrets
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

import bcrypt
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Body, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware

def get_key_overrides(request: Request):
    return {
        "gemini_key": request.headers.get("x-gemini-key"),
        "groq_key": request.headers.get("x-groq-key"),
        "hf_key": request.headers.get("x-hf-key")
    }
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
import pypdf
import io
import re
import urllib.parse
import requests

print("[STARTUP] Initializing FastAPI...")
try:
    app = FastAPI(title="Brainexa Auth & Knowledge Service")
    print("[STARTUP] FastAPI initialized.")
except Exception as e:
    print(f"[CRITICAL] FastAPI failed: {e}")
    raise

# CORS configuration (MUST be before mounting)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the generated images directory
image_dir = os.path.join(os.path.dirname(__file__), "generated_images")
if not os.path.exists(image_dir):
    os.makedirs(image_dir)
app.mount("/images", StaticFiles(directory=image_dir), name="images")

# Load environment variables
basedir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(basedir, "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)

print("[STARTUP] Loading AIHelper...")
try:
    try:
        from .ai_helper import AIHelper
    except ImportError:
        from ai_helper import AIHelper
    engine = AIHelper()
    print("[STARTUP] AIHelper loaded.")
except Exception as e:
    print(f"[CRITICAL] AIHelper failed: {e}")
    import traceback
    print(traceback.format_exc())
    raise

@app.get("/")
async def root():
    return {"status": "online", "service": "Brainexa Python Backend"}

@app.post("/knowledge/direct-answer")
async def direct_answer(request: Request, topic: str = Body(..., embed=True)):
    data = await engine.get_direct_answer(topic, **get_key_overrides(request))
    return data

# Helper to check subscription status
def is_subscribed(user_id: str) -> bool:
    # Check if we are running locally or if database is not reachable
    host = os.getenv("PGHOST", "localhost")
    is_local = host in ["localhost", "127.0.0.1"] or os.getenv("DATABASE_URL") is None
    
    conn = get_db_connection()
    if not conn:
        return True  # Avoid blocking if DB connection fails locally
    cur = conn.cursor()
    try:
        cur.execute('SELECT plan, role FROM users WHERE id = %s::uuid', (user_id,))
        row = cur.fetchone()
        if row:
            plan, role = row[0], row[1]
            if plan != 'free' or role == 'admin' or is_local:
                return True
        return False
    except Exception as e:
        print(f"Error checking subscription in is_subscribed: {e}")
        # fallback query if role column doesn't exist for some reason
        try:
            cur.execute('SELECT plan FROM users WHERE id = %s::uuid', (user_id,))
            row = cur.fetchone()
            if row:
                plan = row[0]
                if plan != 'free' or is_local:
                    return True
            return False
        except Exception as e2:
            print(f"Fallback error: {e2}")
            return True  # Allow users to generate on error
    finally:
        cur.close()
        conn.close()

@app.post("/knowledge/generate-material")
async def generate_material(
    request: Request,
    subject: str = Body(..., embed=True),
    topics: list[str] = Body(..., embed=True),
    customInstructions: Optional[str] = Body(None, embed=True),
    depth: str = Body("detailed", embed=True),
    userId: Optional[str] = Body(None, embed=True)
):
    # Only subscribed users can generate material
    if userId is None or not is_subscribed(userId):
        raise HTTPException(status_code=403, detail="Access denied: subscription required")

    # Generate material
    keys = get_key_overrides(request)
    content = await engine.generate_study_material(subject, topics, customInstructions, depth=depth, **keys)
    if content and not content.startswith("Error:"):
        try:
            import json
            import re
            import asyncio
            # Clean possible markdown code blocks
            clean_json = content.replace("```json", "").replace("```", "").strip()
            
            try:
                material_data = json.loads(clean_json)
            except json.JSONDecodeError:
                def fix_newlines(match):
                    return match.group(0).replace('\n', '\\n')
                repaired_json = re.sub(r'":\s*"([^"]*?)"', fix_newlines, clean_json, flags=re.DOTALL)
                material_data = json.loads(repaired_json)

            # Process Visual Tags concurrently using asyncio.gather to make it faster
            if "content" in material_data:
                content_str = material_data["content"]
                visual_tags = re.findall(r'!\[VISUAL:\s*(.*?)\]', content_str)
                
                print(f"DEBUG: Found {len(visual_tags)} visual tags in content. Processing concurrently.")
                
                async def fetch_and_encode_image(prompt):
                    filename = await engine.generate_image(prompt, hf_key=keys.get("hf_key"))
                    if filename:
                        b64_data = engine.get_image_base64(filename)
                        if b64_data:
                            return prompt, f"data:image/png;base64,{b64_data}"
                    return prompt, None

                # Process all visual tag generations in parallel
                tasks = [fetch_and_encode_image(tag) for tag in visual_tags]
                results = await asyncio.gather(*tasks)

                for prompt, image_url in results:
                    if image_url:
                        content_str = content_str.replace(f"![VISUAL: {prompt}]", f"![{prompt}]({image_url})")
                        content_str = content_str.replace(f"![VISUAL:{prompt}]", f"![{prompt}]({image_url})")
                        print(f"DEBUG: Concurrent image embedded.")
                    else:
                        print(f"DEBUG: Image generation failed for: {prompt}. Falling back to Unsplash.")
                        fallback_url = f"https://source.unsplash.com/featured/?{urllib.parse.quote(prompt)},education"
                        content_str = content_str.replace(f"![VISUAL: {prompt}]", f"![{prompt}]({fallback_url})")
                        content_str = content_str.replace(f"![VISUAL:{prompt}]", f"![{prompt}]({fallback_url})")
                
                material_data["content"] = content_str

            return {"success": True, "material": material_data, "depth": depth}
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            return {"success": True, "content": content, "depth": depth}
    return {"success": False, "error": content, "depth": depth}

@app.post("/knowledge/regenerate-plan")
async def regenerate_plan(
    request: Request,
    userId: str = Body(..., embed=True)
) -> dict:
    """Delete any existing study plan for the user and generate a fresh one.
    Returns the newly generated material or success flag.
    """
    # Ensure the user is subscribed
    if not is_subscribed(userId):
        raise HTTPException(status_code=403, detail="Access denied: subscription required")
    # Delete existing plan rows (assumes a table named study_plans)
    conn = get_db_connection()
    if conn:
        cur = conn.cursor()
        try:
            cur.execute('DELETE FROM study_plans WHERE user_id = %s::uuid', (userId,))
            conn.commit()
        finally:
            cur.close()
            conn.close()
    # After deletion, generate a new plan using the existing engine method.
    # For simplicity, we reuse generate_material with placeholder values.
    # You may adjust the subject/topics as needed.
    placeholder_subject = "General"
    placeholder_topics: list[str] = []
    content = await engine.generate_study_material(placeholder_subject, placeholder_topics, None, **get_key_overrides(request))
    return {"success": True, "plan": content}

# ... existing routes ...




# Database Connection
def get_db_connection():
    try:
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            return psycopg2.connect(db_url, sslmode='require')
            
        conn = psycopg2.connect(
            user=os.getenv("PGUSER", "postgres"),
            password=os.getenv("PGPASSWORD", "123456789"),
            host=os.getenv("PGHOST", "localhost"),
            port=os.getenv("PGPORT", "5432"),
            database=os.getenv("PGDATABASE", "brainexa")
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Models
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class VerificationOTPRequest(BaseModel):
    email: EmailStr
    otp: str

# Email service
def send_reset_email(to_email: str, token: str):
    sender_email = os.getenv("EMAIL_USER", "brainexa.ai.support@gmail.com")
    password = os.getenv("EMAIL_PASS", "").replace(' ', '')
    if not password:
        print("ERROR: EMAIL_PASS environment variable is missing.")
        return False
    smtp_server = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("EMAIL_PORT", 587))

    subject = "Reset Your Brainexa Password"
    # Frontend URL (standard port 8080/3000 depends on user env, but the prompt said 3000)
    reset_link = f"{os.getenv('FRONTEND_URL', 'https://www.brainexa.co.in')}/reset-password?token={token}"

    body = f"""Hello,

You requested to reset your Brainexa account password.

Click the link below to reset your password:

{reset_link}

This link will expire in 15 minutes.

If you did not request this request, please ignore this email.

– Brainexa Team
"""

    msg = MIMEMultipart()
    msg['From'] = f"Brainexa AI Mentor <{sender_email}>"
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        try:
            server.login(sender_email, password)
        except smtplib.SMTPAuthenticationError:
            print("ERROR: SMTP Authentication Error: Username and Password not accepted.")
            print("TIP: If using Gmail, you likely need a 'Google App Password' instead of your regular password.")
            return "AUTH_FAILED"
        
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"ERROR: Email sending error: {e}")
        return False

@app.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cur = conn.cursor()
    try:
        # Check if user exists
        cur.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        user = cur.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Generate token and expiry
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(minutes=15)
        
        # Store in DB
        cur.execute(
            "UPDATE users SET reset_token = %s, token_expiry = %s WHERE email = %s",
            (token, expiry, req.email)
        )
        conn.commit()
        
        # Send email
        result = send_reset_email(req.email, token)
        if result == True:
            return {"message": "Reset link sent to email"}
        elif result == "AUTH_FAILED":
            raise HTTPException(
                status_code=500, 
                detail="SMTP Authentication failed. Please use a Google App Password if using Gmail."
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to send email. Check server logs.")
            
    finally:
        cur.close()
        conn.close()

@app.post("/send-verification-otp")
async def send_verification_otp(request: Request, req: VerificationOTPRequest):
    sender_email = os.getenv("EMAIL_USER", "brainexa.ai.support@gmail.com")
    password = os.getenv("EMAIL_PASS", "").replace(' ', '')
    if not password:
        raise HTTPException(status_code=500, detail="EMAIL_PASS environment variable is missing")
    smtp_server = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("EMAIL_PORT", 587))

    subject = "Verify Your Brainexa Account"
    body = f"""Hello,

Your verification code for Brainexa is:

{req.otp}

This code will expire in 10 minutes.

If you did not request this, please ignore this email.

– Brainexa Team
"""

    msg = MIMEMultipart()
    msg['From'] = f"Brainexa AI Mentor <{sender_email}>"
    msg['To'] = req.email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Use Brevo API to bypass Render's SMTP block and allow sending to anyone
    brevo_api_key = request.headers.get("x-brevo-key") or os.getenv("BREVO_API_KEY")
    if brevo_api_key:
        try:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "api-key": brevo_api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "sender": {"name": "Brainexa AI", "email": "brainexa.ai.support@gmail.com"},
                "to": [{"email": req.email}],
                "subject": subject,
                "textContent": body
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            
            if response.status_code in [200, 201]:
                return {"message": "Verification code sent"}
            else:
                print(f"Brevo Error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail=f"Email delivery failed: {response.text}")
                
        except Exception as e:
            print(f"ERROR: Email delivery error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Fallback to standard SMTP
        print("[SMTP] BREVO_API_KEY is missing. Falling back to Gmail SMTP...")
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            try:
                server.login(sender_email, password)
            except smtplib.SMTPAuthenticationError:
                print("ERROR: SMTP Authentication Error: Username and Password not accepted.")
                raise HTTPException(
                    status_code=500,
                    detail="SMTP Authentication failed. Please verify your Gmail App Password."
                )
            
            server.send_message(msg)
            server.quit()
            return {"message": "Verification code sent"}
        except Exception as e:
            print(f"ERROR: SMTP Email sending error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to send email via SMTP: {e}")


@app.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cur = conn.cursor()
    try:
        # Validate token and expiry
        cur.execute(
            "SELECT id, token_expiry FROM users WHERE reset_token = %s",
            (req.token,)
        )
        user = cur.fetchone()
        
        if not user:
            raise HTTPException(status_code=400, detail="Invalid token")
        
        expiry = user[1]
        if datetime.now() > expiry:
            raise HTTPException(status_code=400, detail="Token has expired")
        
        # Hash new password
        # Note: bcrypt expects bytes
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(req.new_password.encode('utf-8'), salt).decode('utf-8')
        
        # Update user
        cur.execute(
            "UPDATE users SET password = %s, reset_token = NULL, token_expiry = NULL WHERE id = %s",
            (hashed_pw, user[0])
        )
        conn.commit()
        
        return {"message": "Password updated successfully"}
            
    finally:
        cur.close()
        conn.close()

@app.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return {"success": True, "text": text}
    except Exception as e:
        print(f"ERROR: PDF extraction error: {e}")
        return {"success": False, "error": str(e)}


