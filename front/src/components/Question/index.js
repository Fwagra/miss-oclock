// == Import : npm
import React, { Component } from 'react';
import { answerQuestion, endQuestions } from '../../store/questionsReducer';

class Question extends Component {
  componentDidMount() {
    this.eventSource = '';
    this.listenQuestions();
  }

  state = {
    answer: '',
  }

  listenQuestions = () => {
    const {app, setQuestion, setWinner, endQuestions } = this.props;
    
    const url = new URL(`${process.env.MERCURE_DOMAIN}${process.env.MERCURE_HUB}`);
    url.searchParams.append('topic', `${process.env.MERCURE_DOMAIN}${process.env.MERCURE_QUESTIONS}${app.gameId}.jsonld`);
    const eventSource = new EventSource(url, { withCredentials: true });
    
    eventSource.onmessage = (event) => {
      const { questions, winners } = JSON.parse(event.data);
      if(questions){
        setQuestion(questions);
      }

      if(winners){
        const isWinner = !!(winners.indexOf(app.player.name))
        setWinner(isWinner);
        endQuestions();
      }
    };
  }

  componentWillUnmount(){
    if(typeof this.eventSource !== 'string') {
        this.eventSource.close();
    }
  }

  getAnswers = () => {
    const {answers} = this.props.question;

    const inputs = [];

    answers.forEach((answer, id) => {
      inputs.push(<label  key={id} htmlFor={'answer_'+id}><input id={'answer_'+id} onChange={this.handleInput} type="radio" name="answer" value={answer} />{answer}</label>);
    });

    return inputs;
  }
  handleInput = (e) => {
    this.setState({
      answer: e.target.value,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault(); 

    const {answerQuestion} = this.props;
    const {answer} = this.state;

    answerQuestion(answer);
    
  }
  componentWillUpdate(nextProps, nextState){
    
    const { answered } = nextProps.question;
    const { answer} = this.state;
    
    if(answered && answer.length){
      this.setState({
        answer: '',
      })
    }
    
  }
  render() {
    const { question, app } = this.props;
    
    if(question.ended) {
      if(app.step_1_winner){
        return "Tu as gagné cette étape ! Mais ne pense pas que tout est fini !";
      } else {
        return "Tu n'as pas gagné durant cette étape. Mais reste avec nous, on aura besoin de toi pour la suite !";
      }
    }
    else if(!question.answered) {
        if(question.questionId == 0) {
            return "La première question va bientôt arriver !";
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <h2>{question.question}</h2>
                    { this.getAnswers() }
                    <button type="submit">Valider la réponse</button>
                </form>
            );
        }
    }
    else if (question.last) {
      return "Merci d'avoir répondu ! C'était la dernière question, les résultats vont bientôt arriver !";
    }
    else {
        return "Merci d'avoir répondu, la prochaine question arrive bientôt !";
    }
  }
}
// == Export
export default Question;