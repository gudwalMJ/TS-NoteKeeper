type Note = {
  id: number;
  content: string;
};

class NoteKeeper {
  private notes: Note[] = [];
  private static instance: NoteKeeper;

  private constructor() {}

  public static getInstance(): NoteKeeper {
    if (!NoteKeeper.instance) {
      NoteKeeper.instance = new NoteKeeper();
    }
    return NoteKeeper.instance;
  }

  addNote(content: string): void {
    const note: Note = {
      id: this.notes.length + 1,
      content,
    };
    this.notes.push(note);
  }

  deleteNote(id: number): void {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  listNotes(): void {
    this.notes.forEach((note) => {
      console.log(`${note.id}: ${note.content}`);
    });
  }
}
export default NoteKeeper;
