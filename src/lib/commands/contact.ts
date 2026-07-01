import { register } from "@/lib/shell/registry";
import { t, c, cy, mu, fg, L, pad } from "./_helpers";
import { contacts } from "@/lib/data/portfolio";

register({
  name: "contact",
  description: "Display contact channels.",
  run: ({ compact }) => {
    const w = 12;
    const rows: [string, string][] = [
      ["Email", contacts.email],
      ["Phone", contacts.phone],
      ["Location", contacts.location],
      ["GitHub", contacts.github],
      ["Instagram", contacts.instagram],
      ["Twitter/X", contacts.twitter],
    ];
    return [
      t.rich([
        L(c("Contact")),
        L(""),
        ...rows.map(([label, val]) =>
          compact
            ? L(cy(label + ":"), fg(" " + val))
            : L(pad(cy(label), w), fg(" " + val))
        ),
        L(""),
        L(mu("// type `email` to compose a message right here in the terminal")),
      ]),
    ];
  },
});
