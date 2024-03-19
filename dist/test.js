"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoteKeeper_1 = __importDefault(require("./NoteKeeper"));
const myNotes = NoteKeeper_1.default.getInstance();
myNotes.addNote("Note 1");
myNotes.addNote("Note 2");
myNotes.listNotes();
myNotes.deleteNote(1);
console.log("After deletion:");
myNotes.listNotes();
