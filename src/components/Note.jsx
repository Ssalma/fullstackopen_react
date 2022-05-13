const Note = ({ note, onDelete }) => {
  return (
    <div className="note">
      <p>{note.content}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}

export default Note;