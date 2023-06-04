package com.saltluxinno.marinegarbage.model;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Scanner;

public class pix4Dengine {
    
    public static void main(String[] args) throws IOException, InterruptedException{

        // ** 스캐너 **
        Scanner sc = new Scanner(System.in);


        // ** 변수 지정 **
        String runProgram = "python";
        // String pythonFilePath = "D:\\Project\\marineGarbage\\pix4D\\main.py";
        String startType = "--start-type ";
        String projectName = "--project-name ";
        String imageDir = "--image-dir ";
        String calib = "--calib ";
        String dense = "--dense ";
        String ortho = "--ortho";
        // String pythonFilePath = "D:\\Project\\marineGarbage\\pix4D\\test.py"; // pb 테스트용
        String pythonFilePath = "D:/Project/marineGarbage/pix4D/test.py"; // pb 테스트용


        // ** 입력값 받기 **
        System.out.println("신규 프로젝트 여부를 입력해주세요. (new / existed)");
        startType += sc.next();
        System.out.println("프로젝트 이름을 입력해주세요. (알파벳, 숫자, 하이픈, 언더스코어)");
        projectName += sc.next();
        System.out.println("원본 이미지가 있는 경로를 입력해주세요.");
        imageDir += sc.next();
        System.out.println("(1) CALIB 알고리즘을 추가하겠습니까? (Y/N)");
        calib = sc.next().charAt(0) == ('Y' | 'y') ? calib : "";
        System.out.println("(2) DENSE 알고리즘을 추가하겠습니까? (Y/N)");
        dense = sc.next().charAt(0) == ('Y' | 'y') ? dense : "";
        System.out.println("(3) ORTHO 알고리즘을 추가하겠습니까? (Y/N)");
        ortho = sc.next().charAt(0) == ('Y' | 'y') ? ortho : "";
        

        // ** 입력값 출력 **
        System.out.println("runProgram : " + runProgram + '\n' + "filepath : " +  pythonFilePath + '\n' +
                            "startType : " + startType + '\n' + "projectName : " + projectName + '\n' +
                            "imageDir : " + imageDir + '\n' + "calib : " + calib + '\n' +"dense : " + dense + '\n' +
                            "ortho : " + ortho);

        // ** Process Builder **
        // ProcessBuilder builder = new ProcessBuilder(runProgram, pythonFilePath, startType, projectName, imageDir, calib, dense, ortho);


        // ** Process Builder test **
        ProcessBuilder builder = new ProcessBuilder(runProgram, pythonFilePath);
        // builder.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        // builder.redirectError(ProcessBuilder.Redirect.INHERIT);
        // builder.redirectInput(ProcessBuilder.Redirect.INHERIT);
        System.out.println("프로세스 빌더 커맨드: " + builder.command());

        builder.redirectErrorStream(true);
        Process p = builder.start();
        p.waitFor();

        BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8"));
        
        String line;
        
        while ((line = br.readLine()) != null){
            System.out.println(">>> " + line);
        }
        
        System.out.println("종료");
    }

}
