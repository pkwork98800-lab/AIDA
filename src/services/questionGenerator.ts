
export class QuestionGenerator {
  private templates: Record<string, string[]> = {
    pain: ["Where exactly is the pain?", "How severe is it on a scale of 1-10?", "How long have you had it?"],
    fever: ["What is your current temperature?", "When did the fever start?", "Are you experiencing any chills?"],
    cough: ["Is the cough dry or producing mucus?", "Are you having any difficulty breathing?", "How long have you been coughing?"],
    stomach: ["Are you feeling nauseous?", "When was your last meal?", "Do you have any abdominal pain?"]
  };

  generateInitial(complaint: string): string {
    const lower = complaint.toLowerCase();
    for (const [key, questions] of Object.entries(this.templates)) {
      if (lower.includes(key)) return questions[0];
    }
    return "When did your symptoms first start?";
  }

  generateNext(complaint: string, askedCount: number): string {
    const lower = complaint.toLowerCase();
    for (const [key, questions] of Object.entries(this.templates)) {
      if (lower.includes(key)) {
        return questions[askedCount % questions.length];
      }
    }
    return "Are you experiencing any other symptoms like fever or pain?";
  }
}
