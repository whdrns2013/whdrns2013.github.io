import cv2


capture = cv2.VideoCapture(0)

# width = 640
width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
# height = 480
height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))

capture.set(cv2.CAP_PROP_FRAME_WIDTH, width)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

path = "/Users/jongya/Desktop/test.mp4"
# fps = capture.get(cv2.CAP_PROP_FPS)
fps = 10

fourcc = cv2.VideoWriter_fourcc(*'mp4v')

videoWriter = cv2.VideoWriter(path, fourcc, int(fps), (width, height), True)

while True:
    ret, frame = capture.read()
    
    cv2.line(frame, (0, int(height//3)), (width, int(height//3)), (255, 0, 0), 3)
    cv2.line(frame, (0, int(height*2//3)), (width, int(height*2//3)), (255, 0, 0), 3)
    
    if ret == True:
        cv2.imshow("VideoFrame", frame)
        cv2.waitKey(int(1000/fps))
    
    videoWriter.write(frame)
    
    if cv2.waitKey(int(1000/fps)) == ord('q'):
        break

videoWriter.release()
capture.release()
cv2.destroyAllWindows()

