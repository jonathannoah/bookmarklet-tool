(function () {
  function buildOpenUrl() {
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
    const author = (
      document.querySelector(
        "meta[name='citation_author' i],[name='dc.creator' i]",
      ) as HTMLMetaElement
    )?.content;
    const date = (
      document.querySelector(
        "meta[name='citation_publication_date' i],[name='dc.date' i]",
      ) as HTMLMetaElement
    )?.content;
    const doi = (
      document.querySelector(
        "meta[name='citation_doi' i],[name='publication_doi' i],[name='dc.identifier' i]",
      ) as HTMLMetaElement
    )?.content;

    let rft_atitle, rft_jtitle, rft_aulast, rft_date, rft_id;

    let has_adequate_metadata = false;

    if (article_title) {
      rft_atitle = `&rft.atitle=${encodeURIComponent(article_title)}`;
    }

    if (journal_title) {
      rft_jtitle = `&rft.jtitle=${encodeURIComponent(journal_title)}`;
    }

    if (author) {
      let split_author, last_name;
      if (author.includes(",")) {
        split_author = author
          .trim()
          .replace(/ +(?= )/g, "")
          .split(",");
        last_name = split_author[0];
      } else {
        split_author = author
          .trim()
          .replace(/ +(?= )/g, "")
          .split(" ");
        last_name = split_author[split_author.length - 1];
      }
      rft_aulast = `&rft.aulast=${encodeURIComponent(last_name)}`;
    }

    if (date) {
      if (date.includes("-")) {
        rft_date = `&rft.date=${date.split("-")[0]}`;
      } else if (date.includes("/")) {
        rft_date = `&rft.date=${date.split("/")[0]}`;
      } else {
        rft_date = `&rft.date=${date}`;
      }
    }

    if (doi) {
      rft_id = `&rft_id=info:doi/${doi}`;
      has_adequate_metadata = true;
    }

    if (article_title && journal_title && author && date) {
      has_adequate_metadata = true;
    }

    if (!has_adequate_metadata) {
      return false;
    }

    return `${rft_atitle ?? ""}${rft_jtitle ?? ""}${rft_aulast ?? ""}${rft_date ?? ""}${rft_id ?? ""}`;
  }

  const baseUrl = "BASEURL";

  const additionalParameters = "ADDITIONALPARAMETERS";

  const selection = window.getSelection()?.toString();

  if (selection !== "") {
    return window.open(
      `${baseUrl}&rft_id=info:doi/${selection}${additionalParameters}`,
    );
  }

  const openUrl = buildOpenUrl();

  if (!openUrl) {
    return alert(
      "I did not find enough metadata to locate this article automatically. If you see the DOI for this article on the page, select it with your mouse and click this bookmarklet again",
    );
  }

  return window.open(`${baseUrl}${openUrl}${additionalParameters}`);
})();
