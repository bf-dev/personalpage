import ContactsList from "@/components/ContactsList";

export default function Contacts() {
  return (
    <div className="relative p-5 container bg-black mx-auto max-w-xl min-h-screen text-white z-10">
      <h1 className="text-lg -mb-1">insung cho</h1>
      <h1 className="opacity-70">
        I make things <i>happen</i>
      </h1>
      <hr className="my-3 opacity-70" />
      <h3>brief-introduction</h3>
      <ul className="opacity-70">
        <li>
          born in 2006 in south korea
        </li>
        <li>
            living in tianjin, china
        </li>
      </ul>
      <h3>what-i-like</h3>
      <ul className="opacity-70">
        <li>
            programming; made 20+ projects in 8 years
        </li>
        <li>
            music; fav: @nemothings
        </li>
        <li>
            literature; video gaming;
        </li>
      </ul>
      <h3>details</h3>
      <ul className="opacity-70">
        <li className="sensitive">
            he/him; bi
        </li>
        <li>
            lang: english, korean
        </li>
        <li>
            tz: utc+8
        </li>
      </ul>
      <ContactsList />
    </div>
  );
}
