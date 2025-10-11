(function () {
  interface Meta {
    [index: string]: string;
  }

  const base = new URL("%BASE%");
  const params = new URLSearchParams("%PARAMS%");

  base.searchParams.append("ctx_ver", "Z39.88-2004");
  base.searchParams.append("rft_val_fmt", "info:ofi/fmt:kev:mtx:journal");

  params.forEach((value, key) => base.searchParams.append(key, value));

  const select = window.getSelection()?.toString();

  if (select !== "") {
    base.searchParams.append("rft_id", `info:doi/${select}`);
    return window.open(base);
  }

  const querySelectors: Meta = {
    doi: "meta[name='citation_doi' i],[name='publication_doi' i],[name='dc.identifier' i]",
    atitle: "meta[name='citation_title' i],[name='dc.title' i]",
    jtitle: "meta[name='citation_journal_title' i]",
    aulast: "meta[name='citation_author' i],[name='dc.creator' i]",
    year: "meta[name='citation_publication_date' i],[name='dc.date' i]",
    spage: "meta[name='citation_firstpage' i]",
    epage: "meta[name='citation_lastpage' i]",
  };

  const meta: Meta = {};

  for (let querySelector in querySelectors) {
    meta[querySelector] = (
      document.querySelector(querySelectors[querySelector]) as HTMLMetaElement
    )?.content;
  }

  let has_meta = false;

  if (meta["doi"]) {
    base.searchParams.append("rft_id", `info:doi/${meta["doi"]}`);
    has_meta = true;
  }

  if (meta["atitle"] && meta["jtitle"] && meta["aulast"] && meta["year"]) {
    has_meta = true;
  }

  if (!has_meta) {
    const dialog = document.createElement("dialog");

    dialog.role = "dialog";

    dialog.style =
      "background:#fff;color:#000;width:25em;margin:auto;padding:1em;border:.5em solid black";

    dialog.innerHTML = `<p>I did not find enough metadata to locate this article automatically. If you see the DOI for this article on the page, select it with your mouse and click this bookmarklet again.</p>`;

    const button = document.createElement("button");

    button.textContent = "Okay";

    button.addEventListener("click", () => {
      dialog.close();
    });

    button.style =
      "background:#fff;color:#000float:right;margin-top:1em;border:2px solid black;padding:4px;cursor:pointer;";

    dialog.appendChild(button);

    document.body.appendChild(dialog);

    return dialog.showModal();
  }

  if (meta["atitle"]) {
    base.searchParams.append("rft.atitle", meta["atitle"]);
  }

  if (meta["jtitle"]) {
    base.searchParams.append("rft.jtitle", meta["jtitle"]);
  }

  if (meta["aulast"]) {
    let split: string | string[], lname: string;
    if (meta["aulast"].includes(",")) {
      split = meta["aulast"]
        .trim()
        .replace(/ +(?= )/g, "")
        .split(",");
      lname = split[0];
    } else {
      split = meta["aulast"]
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ");
      lname = split[split.length - 1];
    }
    base.searchParams.append("rft.aulast", lname);
  }

  if (meta["year"]) {
    if (meta["year"].includes("-")) {
      base.searchParams.append("rft.date", meta["year"].split("-")[0]);
    } else if (meta["year"].includes("/")) {
      base.searchParams.append("rft.date", meta["year"].split("/")[0]);
    } else {
      base.searchParams.append("rft.date", meta["year"]);
    }
  }

  if (meta["spage"]) {
    base.searchParams.append("rft.spage", meta["spage"]);
  }

  if (meta["epage"]) {
    base.searchParams.append("rft.epage", meta["epage"]);
  }

  window.open(base.href, "_blank");
})();
