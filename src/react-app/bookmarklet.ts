(function () {
  const base = new URL("%BASE%");
  const params = new URLSearchParams("%PARAMS%");

  const selection = window.getSelection()?.toString();

  if (selection !== "") {
    return window.open(`${base}&rft_id=info:doi/${selection}${params}`);
  }

  params.forEach((value, key) => base.searchParams.append(key, value));

  console.log(base.href);

  const doi = (
    document.querySelector(
      "meta[name='citation_doi' i],[name='publication_doi' i],[name='dc.identifier' i]",
    ) as HTMLMetaElement
  )?.content;

  const article_title = (
    document.querySelector(
      "meta[name='citation_title' i],[name='dc.title' i]",
    ) as HTMLMetaElement
  )?.content;

  const journal_title = (
    document.querySelector(
      "meta[name='citation_journal_title' i]",
    ) as HTMLMetaElement
  )?.content;

  const last_name_of_first_author = (
    document.querySelector(
      "meta[name='citation_author' i],[name='dc.creator' i]",
    ) as HTMLMetaElement
  )?.content;

  const year = (
    document.querySelector(
      "meta[name='citation_publication_date' i],[name='dc.date' i]",
    ) as HTMLMetaElement
  )?.content;

  const last_page = (
    document.querySelector(
      "meta[name='citation_lastpage' i]",
    ) as HTMLMetaElement
  )?.content;

  const first_page = (
    document.querySelector(
      "meta[name='citation_firstpage' i]",
    ) as HTMLMetaElement
  )?.content;

  let has_adequate_metadata = false;

  if (doi) {
    base.searchParams.append("rft_id", `info:doi/${doi}`);
    has_adequate_metadata = true;
  }

  if (article_title) {
    base.searchParams.append("rft.atitle", article_title);
  }

  if (journal_title) {
    base.searchParams.append("rft.jtitle", journal_title);
  }

  if (last_name_of_first_author) {
    let split_author, last_name;
    if (last_name_of_first_author.includes(",")) {
      split_author = last_name_of_first_author
        .trim()
        .replace(/ +(?= )/g, "")
        .split(",");
      last_name = split_author[0];
    } else {
      split_author = last_name_of_first_author
        .trim()
        .replace(/ +(?= )/g, "")
        .split(" ");
      last_name = split_author[split_author.length - 1];
    }
    base.searchParams.append("rft.aulast", last_name);
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

  if (first_page) {
    base.searchParams.append("rft.spage", first_page);
  }

  if (last_page) {
    base.searchParams.append("rft.epage", last_page);
  }

  if (article_title && journal_title && last_name_of_first_author && year) {
    has_adequate_metadata = true;
  }

  if (!has_adequate_metadata) {
    return alert(
      "I did not find enough metadata to locate this article automatically. If you see the DOI for this article on the page, select it with your mouse and click this bookmarklet again",
    );
  }

  base.searchParams.append("ctx_ver", "Z39.88-2004");
  base.searchParams.append("rft_val_fmt", "info:ofi/fmt:kev:mtx:journal");

  window.open(base.href, "_blank");
})();
