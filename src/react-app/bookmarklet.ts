/*! v0.1.0 */
(function () {
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

  const querySelectors: { [index: string]: string } = {
    doi: "meta[name='citation_doi' i],[name='publication_doi' i],[name='dc.identifier' i]",
    atitle: "meta[name='citation_title' i],[name='dc.title' i]",
    jtitle: "meta[name='citation_journal_title' i]",
    aulast: "meta[name='citation_author' i],[name='dc.creator' i]",
    year: "meta[name='citation_publication_date' i],[name='dc.date' i]",
    spage: "meta[name='citation_firstpage' i]",
    epage: "meta[name='citation_lastpage' i]",
    volume: "meta[name='citation_volume' i]",
    issue: "meta[name='citation_issue' i]",
    issn: "meta[name='citation_issn' i]",
  };

  const rftParams: { [index: string]: string } = {};

  for (const querySelector in querySelectors) {
    rftParams[querySelector] = (
      document.querySelector(querySelectors[querySelector]) as HTMLMetaElement
    )?.content;
  }

  let has_meta = false;

  if (rftParams["doi"]) {
    base.searchParams.append("rft_id", `info:doi/${rftParams["doi"]}`);
    has_meta = true;
  }

  if (
    rftParams["atitle"] &&
    rftParams["jtitle"] &&
    rftParams["aulast"] &&
    rftParams["year"]
  ) {
    has_meta = true;
  }

  if (!has_meta) {
    return alert(
      "I did not find enough metadata to locate this article automatically. If you see the DOI for this article on the page, select it with your mouse and click this bookmarklet again",
    );
  }

  if (rftParams["atitle"]) {
    base.searchParams.append("rft.atitle", rftParams["atitle"]);
  }

  if (rftParams["jtitle"]) {
    base.searchParams.append("rft.jtitle", rftParams["jtitle"]);
  }

  if (rftParams["aulast"]) {
    let split: string | string[], lname: string;
    if (rftParams["aulast"].includes(",")) {
      split = rftParams["aulast"]
        .trim()
        .replace(/ +(?= )/g, "")
        .split(",");
      lname = split[0];
    } else {
      split = rftParams["aulast"]
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ");
      lname = split[split.length - 1];
    }
    base.searchParams.append("rft.aulast", lname);
  }

  if (rftParams["year"]) {
    if (rftParams["year"].includes("-")) {
      base.searchParams.append("rft.date", rftParams["year"].split("-")[0]);
    } else if (rftParams["year"].includes("/")) {
      base.searchParams.append("rft.date", rftParams["year"].split("/")[0]);
    } else {
      base.searchParams.append("rft.date", rftParams["year"]);
    }
  }

  if (rftParams["spage"]) {
    base.searchParams.append("rft.spage", rftParams["spage"]);
  }

  if (rftParams["epage"]) {
    base.searchParams.append("rft.epage", rftParams["epage"]);
  }

  window.open(base.href, "_blank");
})();
