# ============================================
# Build Script for Windows PowerShell
# ============================================

Write-Host "=== Building AI Quest Application ===" -ForegroundColor Cyan
Write-Host ""

# Install frontend dependencies
Write-Host "=== Installing frontend dependencies ===" -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

# Copy frontend build to backend/static
Write-Host "=== Copying frontend build to backend/static ===" -ForegroundColor Yellow
if (Test-Path backend\static) {
    Remove-Item -Recurse -Force backend\static
}
Copy-Item -Recurse frontend\dist backend\static

# Install backend dependencies
Write-Host "=== Installing backend dependencies ===" -ForegroundColor Yellow
Set-Location backend
python -m pip install --upgrade pip
pip install -r requirements.txt
Set-Location ..

Write-Host ""
Write-Host "=== Build complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend built and copied to backend/static" -ForegroundColor Green
Write-Host "Backend dependencies installed" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  python -m uvicorn app.main:app --reload" -ForegroundColor White
