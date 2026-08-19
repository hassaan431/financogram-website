from PIL import Image

def remove_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    # Get the background color from top-left pixel
    bg_color = datas[0]
    
    new_data = []
    # Tolerance for color matching
    tolerance = 30
    
    for item in datas:
        if (abs(item[0] - bg_color[0]) < tolerance and 
            abs(item[1] - bg_color[1]) < tolerance and 
            abs(item[2] - bg_color[2]) < tolerance):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print("Saved to", output_path)

remove_bg("assets/logo.png", "assets/logo-transparent.png")
