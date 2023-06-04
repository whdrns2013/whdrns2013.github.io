package com.saltluxinno.marinegarbage.model;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Scanner;


public class pix4Dengine {
    
    public static void main(String[] args) throws IOException, InterruptedException{

        // ** 스캐너 **
        Scanner sc = new Scanner(System.in);


        // ** args 변수 지정 **
        String runProgram = "python";
        String pythonFilePath = "D:/Project/marineGarbage/pix4D/main.py";
        String arg_startType = "--start-type";
        String arg_projectName = "--project-name";
        String arg_imageDir = "--image-dir";
        String arg_calib = "--calib";
        String arg_dense = "--dense";
        String arg_ortho = "--ortho";


        // ** args를 담는 ArrayList 생성 **
        ArrayList<String> argList = new ArrayList<String>();
        argList.add(runProgram);
        argList.add(pythonFilePath);


        // ** 입력값 받기 > List에 담기 **
        System.out.println("신규 프로젝트 여부를 입력해주세요. (new / existed)");
        argList.add(arg_startType);
        argList.add(sc.next());
        System.out.println("프로젝트 이름을 입력해주세요. (알파벳, 숫자, 하이픈, 언더스코어)");
        argList.add(arg_projectName);
        argList.add(sc.next());
        System.out.println("원본 이미지가 있는 경로를 입력해주세요.");
        argList.add(arg_imageDir);
        argList.add(sc.next());
        System.out.println("(1) CALIB 알고리즘을 추가하겠습니까? (Y/N)");
        if (sc.next().charAt(0) == ('Y') | sc.next().charAt(0) == ('y')) argList.add(arg_calib);
        System.out.println("(2) DENSE 알고리즘을 추가하겠습니까? (Y/N)");
        if (sc.next().charAt(0) == ('Y') | sc.next().charAt(0) == ('y')) argList.add(arg_dense);
        System.out.println("(3) ORTHO 알고리즘을 추가하겠습니까? (Y/N)");
        if (sc.next().charAt(0) == ('Y') | sc.next().charAt(0) == ('y')) argList.add(arg_ortho);
        

        // ** Scanner 닫기 **
        System.out.println(argList);
        sc.close();


        // ** Process Builder **
        // ProcessBuilder builder = new ProcessBuilder(runProgram, pythonFilePath, arg_startType, startType,
        //                                             arg_projectName, projectName, arg_imageDir, imageDir,
        //                                             calib, dense, ortho);
        ProcessBuilder builder = new ProcessBuilder(argList);

        System.out.println("프로세스 빌더 커맨드: " + builder.command());

        builder.redirectErrorStream(true);
        Process p = builder.start();

        BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8"));
        String line;
        while ((line = br.readLine()) != null){
            System.out.println(">>> " + line);
        }
        
        p.waitFor(); // 이거를 먼저 선언해버리면 출력 결과를 다 완료된 후에나 받을 수 있음. 어 상관없네. 어디에 위치해도 상관 없음.

        System.out.println("종료");
    }

}
