const {getPersonalInfo,
  getSicknessLeave,
  getVacationLeave,
  getTodoSum,
  getTodoSummary,
  getMyWorkflowRequests,
  getMyNotifications } = require('../sf-functions');
const {CEKResponse} = require('./cekResponse')
module.exports = class CEKRequest {
  constructor (httpReq) {
    this.request = httpReq.body.request
    this.context = httpReq.body.context
    this.session = httpReq.body.session
    console.log(`CEK Request: ${JSON.stringify(this.context)}, ${JSON.stringify(this.session)}`)
  }

  do(cekResponse) {
    switch (this.request.type) {
      case 'LaunchRequest':
        return this.launchRequest(cekResponse)
      case 'IntentRequest':
        return this.intentRequest(cekResponse)
      case 'SessionEndedRequest':
        return this.sessionEndedRequest(cekResponse)
    }
  }

  // 클로바에서 앱을 처음 호출하면 발생
  launchRequest(cekResponse) {
    console.log('launchRequest')
    cekResponse.setSimpleSpeechText('안녕하세요, 저는 successfactors 도우미 레오에요! 무엇을 도와드릴까요?')
    cekResponse.setMultiturn({
      intent: 'GetTodosIntent',
    })
  }

  // 클로바 앱 시작부터 종료 시점까지 실행
  intentRequest(cekResponse) {
    console.log('intentRequest')
    console.dir(this.request)
    const intent = this.request.intent.name
    const slots = this.request.intent.slots

    switch (intent) {
    // Todo
    case 'getMyNotificationsIntent':
      var myNotifications = getMyNotifications()
      cekResponse.appendSpeechText(`현재 공지사항은 다음과 같습니다: ${myNotifications}`)
      break;
    case 'GetMyWorkflowRequestsIntent':
      var myWorkflowRequests = getMyWorkflowRequests()
      var requestSum = myWorkflowRequests.d.results.length
      var requestSummary = myWorkflowRequests.d.results[0].todos.results[0].entries.results[0].subjectFullName
      cekResponse.appendSpeechText(`현재 승인할 Workflow는 다음과 같이 ${requestSum}가지가 있습니다: ${requestSummary}`)
      break;
    case 'GetTodoSummaryIntent':
      var todoSummary = getTodoSummary()
      cekResponse.appendSpeechText(`할일에 대한 브리핑 드리겠습니다. ${todoSummary}`)
      break;
    case 'GetTodosIntent':
      var todoSum = getTodoSum()
      cekResponse.appendSpeechText(`할일이 ${todoSum}개 남았습니다.`)
      break
    // Time Off
    case 'GetSicknessLeaveIntent':
      var sicknessSum = getSicknessLeave()
      cekResponse.appendSpeechText(`병가가 ${sicknessSum}일 남았습니다.`)
      break
    case 'GetVacationLeaveIntent':
      var vacationSum = getVacationLeave()
      cekResponse.appendSpeechText(`휴가가 ${vacationSum}일 남았습니다.`)
      break
    // Unknown
    default:
      cekResponse.appendSpeechText(`죄송합니다. 더 학습해서 다음에 이해하도록 하겠습니다.`)
      break
    }

    if (this.session.new == false) {
      cekResponse.setMultiturn()
    }
  }

  // 클로바에 앱 종료 메세지를 호출하면 발생
  sessionEndedRequest(cekResponse) {
    console.log('sessionEndedRequest')
    cekResponse.setSimpleSpeechText('레오나르도 익스텐션을 종료합니다.')
    cekResponse.clearMultiturn()
  }
}
