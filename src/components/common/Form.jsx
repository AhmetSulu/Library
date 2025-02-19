export default function Form({ onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className="form">
      {children}
      <div className="form-footer">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
}