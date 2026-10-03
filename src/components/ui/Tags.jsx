/**
 * FILE: src/components/ui/Tags.jsx
 * WHAT IT DOES
 *   A wrapping row of small pill labels (skills, tools).
 */
export default function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
