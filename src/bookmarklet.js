(function () {
  var _a;
  function buildOpenUrl() {
    var _a, _b, _c, _d, _e;
    var article_title =
      (_a = document.querySelector(
        "meta[name='citation_title' i],[name='dc.title' i]",
      )) === null || _a === void 0
        ? void 0
        : _a.content;
    var journal_title =
      (_b = document.querySelector("meta[name='citation_journal_title' i]")) ===
        null || _b === void 0
        ? void 0
        : _b.content;
    var author =
      (_c = document.querySelector(
        "meta[name='citation_author' i],[name='dc.creator' i]",
      )) === null || _c === void 0
        ? void 0
        : _c.content;
    var date =
      (_d = document.querySelector(
        "meta[name='citation_publication_date' i],[name='dc.date' i]",
      )) === null || _d === void 0
        ? void 0
        : _d.content;
    var doi =
      (_e = document.querySelector(
        "meta[name='citation_doi' i],[name='publication_doi' i],[name='dc.identifier' i]",
      )) === null || _e === void 0
        ? void 0
        : _e.content;
    var rft_atitle, rft_jtitle, rft_aulast, rft_date, rft_id;
    var has_adequate_metadata = false;
    if (article_title) {
      rft_atitle = "&rft.atitle=".concat(encodeURIComponent(article_title));
    }
    if (journal_title) {
      rft_jtitle = "&rft.jtitle=".concat(encodeURIComponent(journal_title));
    }
    if (author) {
      var split_author = void 0,
        last_name = void 0;
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
      rft_aulast = "&rft.aulast=".concat(encodeURIComponent(last_name));
    }
    if (date) {
      if (date.includes("-")) {
        rft_date = "&rft.date=".concat(date.split("-")[0]);
      } else if (date.includes("/")) {
        rft_date = "&rft.date=".concat(date.split("/")[0]);
      } else {
        rft_date = "&rft.date=".concat(date);
      }
    }
    if (doi) {
      rft_id = "&rft_id=info:doi/".concat(doi);
      has_adequate_metadata = true;
    }
    if (article_title && journal_title && author && date) {
      has_adequate_metadata = true;
    }
    if (!has_adequate_metadata) {
      return false;
    }
    return ""
      .concat(rft_atitle !== null && rft_atitle !== void 0 ? rft_atitle : "")
      .concat(rft_jtitle !== null && rft_jtitle !== void 0 ? rft_jtitle : "")
      .concat(rft_aulast !== null && rft_aulast !== void 0 ? rft_aulast : "")
      .concat(rft_date !== null && rft_date !== void 0 ? rft_date : "")
      .concat(rft_id !== null && rft_id !== void 0 ? rft_id : "");
  }
  var baseUrl = "BASEURL";
  var additionalParameters = "ADDITIONALPARAMETERS";
  var selection =
    (_a = window.getSelection()) === null || _a === void 0
      ? void 0
      : _a.toString();
  if (selection !== "") {
    return window.open(
      ""
        .concat(baseUrl, "&rft_id=info:doi/")
        .concat(selection)
        .concat(additionalParameters),
    );
  }
  var openUrl = buildOpenUrl();
  if (!openUrl) {
    return alert(
      "I did not find enough metadata to locate this article automatically. If you see the DOI for this article on the page, select it with your mouse and click this bookmarklet again",
    );
  }
  return window.open(
    "".concat(baseUrl).concat(openUrl).concat(additionalParameters),
  );
})();
