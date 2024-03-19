import NoteKeeper from "./NoteKeeper";

const myNotes = NoteKeeper.getInstance();

myNotes.addNote("Note 1");
myNotes.addNote("Note 2");

myNotes.listNotes();

myNotes.deleteNote(1);

console.log("After deletion:");
myNotes.listNotes();
