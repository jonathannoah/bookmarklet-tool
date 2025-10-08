(function () {
  const base = new URL("%BASE%");
  const params = new URLSearchParams("%PARAMS%");

  base.searchParams.append("ctx_ver", "Z39.88-2004");
  base.searchParams.append("rft_val_fmt", "info:ofi/fmt:kev:mtx:journal");

  params.forEach((value, key) => base.searchParams.append(key, value));

  const select = window.getSelection()?.toString();

  base.searchParams.append("rft_id", `info:doi/${select}`);

  if (select !== "") {
    return window.open(base);
  }

  console.log(base.href);

  const doi = (
    document.querySelector(
      "meta[name='citation_doi' i],[name='publication_doi' i],[name='dc.identifier' i]",
    ) as HTMLMetaElement
  )?.content;

  const atitle = (
    document.querySelector(
      "meta[name='citation_title' i],[name='dc.title' i]",
    ) as HTMLMetaElement
  )?.content;

  const jtitle = (
    document.querySelector(
      "meta[name='citation_journal_title' i]",
    ) as HTMLMetaElement
  )?.content;

  const aulast = (
    document.querySelector(
      "meta[name='citation_author' i],[name='dc.creator' i]",
    ) as HTMLMetaElement
  )?.content;

  const year = (
    document.querySelector(
      "meta[name='citation_publication_date' i],[name='dc.date' i]",
    ) as HTMLMetaElement
  )?.content;

  const spage = (
    document.querySelector(
      "meta[name='citation_firstpage' i]",
    ) as HTMLMetaElement
  )?.content;

  const epage = (
    document.querySelector(
      "meta[name='citation_lastpage' i]",
    ) as HTMLMetaElement
  )?.content;

  let has_meta = false;

  if (doi) {
    base.searchParams.append("rft_id", `info:doi/${doi}`);
    has_meta = true;
  }

  if (atitle && jtitle && aulast && year) {
    has_meta = true;
  }

  if (!has_meta) {
    return alert(
      "I did not find enough metadata to locate this article automatically. If you see the DOI for this article on the page, select it with your mouse and click this bookmarklet again",
    );
  }

  if (atitle) {
    base.searchParams.append("rft.atitle", atitle);
  }

  if (jtitle) {
    base.searchParams.append("rft.jtitle", jtitle);
  }

  if (aulast) {
    let split: string | string[], lname: string;
    if (aulast.includes(",")) {
      split = aulast
        .trim()
        .replace(/ +(?= )/g, "")
        .split(",");
      lname = split[0];
    } else {
      split = aulast
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ");
      lname = split[split.length - 1];
    }
    base.searchParams.append("rft.aulast", lname);
  }

  if (year) {
    if (year.includes("-")) {
      base.searchParams.append("rft.date", year.split("-")[0]);
    } else if (year.includes("/")) {
      base.searchParams.append("rft.date", year.split("/")[0]);
    } else {
      base.searchParams.append("rft.date", year);
    }
  }

  if (spage) {
    base.searchParams.append("rft.spage", spage);
  }

  if (epage) {
    base.searchParams.append("rft.epage", epage);
  }

  window.open(base.href, "_blank");
})();
