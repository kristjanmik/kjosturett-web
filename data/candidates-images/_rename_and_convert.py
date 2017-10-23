from PIL import Image
from shutil import copyfile
import os

# Dir name to write to
dirname = 'jpg'

wd = os.getcwd() #working dir
od = os.path.join(wd, dirname)

if not os.path.exists(od):
  os.makedirs(od)


def png_to_jpg(png):
  im = Image.open(png)
  rgb_im = im.convert('RGB')
  rgb_im.save(os.path.join(od,png.replace('.png', '.jpg')))


for item in os.listdir(wd):
  if os.path.isfile(item):
    split = os.path.splitext(item)
    ext = split[1]
    filename = split[0]
    if ext in ['.jpg','.jpeg']:
      copyfile(
        os.path.join(wd, item),
        os.path.join(od, item.replace('.jpeg', '.jpg')),
      )
    if ext == '.png':
      png_to_jpg(item)
