let handler;

export default async function (req, res) {
  if (!handler) {
    try {
      console.log('📦 Dynamically importing server/index.js...');
      const module = await import('../server/index.js');
      handler = module.default;
      console.log('✅ server/index.js imported successfully');
    } catch (err) {
      console.error('❌ Failed to import server/index.js:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to import server module: ' + err.message,
        stack: err.stack,
        code: err.code
      });
    }
  }

  try {
    return handler(req, res);
  } catch (err) {
    console.error('❌ Request handler crashed:', err);
    return res.status(500).json({
      success: false,
      error: 'Request handler crashed: ' + err.message,
      stack: err.stack
    });
  }
}
