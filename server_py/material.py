import os
from typing import List, Dict, Optional
from fastapi import Body, HTTPException
from .ai_helper import AIHelper
from .main import get_db_connection

engine = AIHelper()

async def generate_material_with_performance(
    subject: str = Body(..., embed=True),
    topics: List[str] = Body(..., embed=True),
    userId: Optional[str] = Body(None, embed=True),
    depth: str = Body("detailed", embed=True)
) -> Dict:
    """Generate study material based on depth preference: 'detailed', 'medium', 'normal'."""
    content = await engine.generate_study_material(subject, topics, None, depth=depth)
    if content.startswith("Error:"):
        return {"success": False, "error": content, "depth": depth}
    return {"success": True, "content": content, "depth": depth}

