import cv2
import os

if __name__ == '__main__':
  
    vidcap = cv2.VideoCapture('./test.mp4')
    res, image = vidcap.read()
    count = 0
    # if you already have this two folders, skip it.
    try:
        os.mkdir('./output')
        os.mkdir('./output/frames')
    except:
        pass
    
    os.chdir('./output/frames/')
    
    while res:
        if(not image):
            break
        cv2.imwrite("%d.jpg" % count, image)
        print(f'wrtie frame {count} to output/frames/{count}.jpg')
        success, image = vidcap.read()
        count += 1