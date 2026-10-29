import type { Category } from "../types";

interface Props {
  categories: Category[];
  selected?: number;
  onSelect: (id?: number) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center my-4">
      <button
        className={`btn btn-sm ${selected === undefined ? "btn-primary" : "btn-outline-dark"}`}
        onClick={() => onSelect(undefined)}
      >
        Todos
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          className={`btn btn-sm ${selected === c.id ? "btn-primary" : "btn-outline-dark"}`}
          onClick={() => onSelect(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}