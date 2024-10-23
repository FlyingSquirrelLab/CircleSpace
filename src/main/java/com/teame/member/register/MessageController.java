package com.teame.member.register;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@Log4j2
@RestController
@RequiredArgsConstructor
public class MessageController {

  private final DefaultMessageService messageService;

  public MessageController() {
    this.messageService = NurigoApp.INSTANCE.initialize(
        "NCSZYPSHC0XZCFUP", "VFUJXMFJOIP1FZEEODADLQ1GGZLBM7PN", "https://api.coolsms.co.kr");
  }

  private String generateRandomNumber() {
    Random rand = new Random();
    StringBuilder numStr = new StringBuilder();
    for (int i = 0; i < 4; i++) {
      numStr.append(rand.nextInt(10));
    }
    return numStr.toString();
  }

  // 메시지 전송
  @PostMapping("/api/register/sendMessage/{phoneNumber}")
  public ResponseEntity<String> sendMessage(@PathVariable String phoneNumber) {
    try {
      String randomNumber = generateRandomNumber();
      Message message = new Message();
      message.setFrom("01035553294");
      message.setTo(phoneNumber);
      message.setText("인증번호 " + randomNumber + " 를 입력하세요.");

      SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
      log.info(response);
      log.info(randomNumber);
      return ResponseEntity.status(HttpStatus.OK).body(randomNumber);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed To Send SMS");
    }
  }

//  여러개의 SMS 한번에 보내기
//  @PostMapping("/send-many")
//  public MultipleDetailMessageSentResponse sendMany() {
//    ArrayList<Message> messageList = new ArrayList<>();
//
//    for (int i = 0; i < 3; i++) {
//      Message message = new Message();
//      // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
//      message.setFrom("발신번호 입력");
//      message.setTo("수신번호 입력");
//      message.setText("한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 추가됩니다." + i);
//
//      // 메시지 건건 마다 사용자가 원하는 커스텀 값(특정 주문/결제 건의 ID를 넣는등)을 map 형태로 기입하여 전송 후 확인해볼 수 있습니다!
//            /*HashMap<String, String> map = new HashMap<>();
//
//            map.put("키 입력", "값 입력");
//            message.setCustomFields(map);
//
//            messageList.add(message);*/
//    }
//
//    try {
//      // send 메소드로 단일 Message 객체를 넣어도 동작합니다!
//      // 세 번째 파라미터인 showMessageList 값을 true로 설정할 경우 MultipleDetailMessageSentResponse에서 MessageList를 리턴하게 됩니다!
//      MultipleDetailMessageSentResponse response = this.messageService.send(messageList, false, true);
//
//      // 중복 수신번호를 허용하고 싶으실 경우 위 코드 대신 아래코드로 대체해 사용해보세요!
//      //MultipleDetailMessageSentResponse response = this.messageService.send(messageList, true);
//
//      System.out.println(response);
//
//      return response;
//    } catch (NurigoMessageNotReceivedException exception) {
//      System.out.println(exception.getFailedMessageList());
//      System.out.println(exception.getMessage());
//    } catch (Exception exception) {
//      System.out.println(exception.getMessage());
//    }
//    return null;
//  }

}