from fastapi import FastAPI, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import base64
import os

app = FastAPI()

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Serve index.html at the root URL
@app.get("/")
async def read_root():
    return FileResponse("static/index.html")

# Animal colors data
animal_colors = {
    "cat": {"body": "#FFD1DC", "box": "#FFA07A"},
    "dog": {"body": "#98FB98", "box": "#90EE90"},
    "elephant": {"body": "#B0E0E6", "box": "#87CEEB"}
}

@app.get("/api/animal/{animal_name}")
async def get_animal(animal_name: str):
    if animal_name in animal_colors:
        image_path = f"static/images/{animal_name}.jpg"
        if os.path.exists(image_path):
            with open(image_path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode("utf-8")
            return JSONResponse({
                "image": f"data:image/jpeg;base64,{image_data}",
                "colors": animal_colors[animal_name]
            })
    return JSONResponse({"error": "Animal not found"}, status_code=404)

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    image_data = base64.b64encode(contents).decode("utf-8")
    return JSONResponse({
        "image": f"data:image/jpeg;base64,{image_data}",
        "filename": file.filename,
        "size": f"{len(contents) / 1024:.2f} KB",
        "type": file.content_type
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
