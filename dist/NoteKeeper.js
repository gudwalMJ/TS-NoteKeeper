"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NoteKeeper {
    constructor() {
        this.notes = [];
    }
    static getInstance() {
        if (!NoteKeeper.instance) {
            NoteKeeper.instance = new NoteKeeper();
        }
        return NoteKeeper.instance;
    }
    addNote(content) {
        const note = {
            id: this.notes.length + 1,
            content,
        };
        this.notes.push(note);
    }
    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id !== id);
    }
    listNotes() {
        this.notes.forEach((note) => {
            console.log(`${note.id}: ${note.content}`);
        });
    }
}
exports.default = NoteKeeper;
