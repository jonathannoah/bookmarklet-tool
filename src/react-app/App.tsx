// src/App.tsx

import { useRef, useState } from "react";

function App() {
  const [baseUrl, setBaseUrl] = useState<string>();
  const [bookmarklet, setBookmarklet] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [parameters, setParameters] = useState<string>();

  const bookmarkletCodeRef:
    | React.RefObject<HTMLTextAreaElement>
    | React.RefObject<null> = useRef(null);

  function selectAllText() {
    if (bookmarkletCodeRef.current) {
      bookmarkletCodeRef.current.select();
    }
  }

  function BookmarkletPreview() {
    if (!bookmarklet) {
      return false;
    }

    return (
      <>
        <h2 className="text-xl mb-5">Preview</h2>

        <div
          className="card w-3/4 bg-base-100 shadow-md p-10 mx-auto"
          dangerouslySetInnerHTML={createBookmarkletPreview()}
        />

        <p className="mt-10">
          Copy the code below to add this bookmarklet to your webpage.
        </p>
        <textarea
          ref={bookmarkletCodeRef}
          value={createBookmarkletEmbed().__html}
          onClick={selectAllText}
          readOnly
          className="textarea w-full h-72 mt-3"
        />
      </>
    );
  }

  function createBookmarkletPreview() {
    return {
      __html: `<a href="${bookmarklet ?? ""}" class="link link-info" ${!bookmarklet ? "disabled" : ""}>${title ?? "Find@MyLibrary"}</a><p class="mt-2">Drag this link to your bookmarks toolbar. Click "save" if prompted.</p>`,
    };
  }

  function createBookmarkletEmbed() {
    return {
      __html: `<a href="${bookmarklet ?? ""}" ${!bookmarklet ? "disabled" : ""}>${title ?? "Find@MyLibrary"}</a><p>Drag this link to your bookmarks toolbar. Click "save" if prompted.</p>`,
    };
  }

  function handleBaseUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.validity.valid) {
      setBaseUrl(e.target.value);
    } else {
      setBaseUrl("");
      setBookmarklet("");
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value !== "") {
      setTitle(e.target.value);
    } else setTitle("Find@MyLibrary");
  }

  function handleParametersChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value !== "") {
      setParameters(e.target.value);
    } else setParameters("");
  }

  function createBookmarklet(e: { preventDefault: () => void }) {
    e.preventDefault();
    // Massive pre-shrunk Javascript blob
    const bookmarkletFunction = `javascript:(function()%7Bvar%20l%3Bfunction%20U()%7Bvar%20d%2Cu%2Cf%2Cv%2Cm%2C_%3D(d%3Ddocument.querySelector(%22meta%5Bname%3D'citation_title'%20i%5D%2C%5Bname%3D'dc.title'%20i%5D%22))%3D%3D%3Dnull%7C%7Cd%3D%3D%3Dvoid%200%3Fvoid%200%3Ad.content%2Cs%3D(u%3Ddocument.querySelector(%22meta%5Bname%3D'citation_journal_title'%20i%5D%22))%3D%3D%3Dnull%7C%7Cu%3D%3D%3Dvoid%200%3Fvoid%200%3Au.content%2Ci%3D(f%3Ddocument.querySelector(%22meta%5Bname%3D'citation_author'%20i%5D%2C%5Bname%3D'dc.creator'%20i%5D%22))%3D%3D%3Dnull%7C%7Cf%3D%3D%3Dvoid%200%3Fvoid%200%3Af.content%2Ct%3D(v%3Ddocument.querySelector(%22meta%5Bname%3D'citation_publication_date'%20i%5D%2C%5Bname%3D'dc.date'%20i%5D%22))%3D%3D%3Dnull%7C%7Cv%3D%3D%3Dvoid%200%3Fvoid%200%3Av.content%2Cw%3D(m%3Ddocument.querySelector(%22meta%5Bname%3D'citation_doi'%20i%5D%2C%5Bname%3D'publication_doi'%20i%5D%2C%5Bname%3D'dc.identifier'%20i%5D%22))%3D%3D%3Dnull%7C%7Cm%3D%3D%3Dvoid%200%3Fvoid%200%3Am.content%2Co%2Ca%2Cc%2Ce%2Cr%2Cp%3D!1%3Bif(_%26%26(o%3D%22%26rft.atitle%3D%22.concat(encodeURIComponent(_)))%2Cs%26%26(a%3D%22%26rft.jtitle%3D%22.concat(encodeURIComponent(s)))%2Ci)%7Bvar%20n%3Dvoid%200%2CS%3Dvoid%200%3Bi.includes(%22%2C%22)%3F(n%3Di.trim().replace(%2F%20%2B(%3F%3D%20)%2Fg%2C%22%22).split(%22%2C%22)%2CS%3Dn%5B0%5D)%3A(n%3Di.trim().replace(%2F%20%2B(%3F%3D%20)%2Fg%2C%22%22).split(%22%20%22)%2CS%3Dn%5Bn.length-1%5D)%2Cc%3D%22%26rft.aulast%3D%22.concat(encodeURIComponent(S))%7Dreturn%20t%26%26(t.includes(%22-%22)%3Fe%3D%22%26rft.date%3D%22.concat(t.split(%22-%22)%5B0%5D)%3At.includes(%22%2F%22)%3Fe%3D%22%26rft.date%3D%22.concat(t.split(%22%2F%22)%5B0%5D)%3Ae%3D%22%26rft.date%3D%22.concat(t))%2Cw%26%26(r%3D%22%26rft_id%3Dinfo%3Adoi%2F%22.concat(w)%2Cp%3D!0)%2C_%26%26s%26%26i%26%26t%26%26(p%3D!0)%2Cp%3F%22%22.concat(o%3F%3F%22%22).concat(a%3F%3F%22%22).concat(c%3F%3F%22%22).concat(e%3F%3F%22%22).concat(r%3F%3F%22%22)%3A!1%7Dvar%20g%3D%22${baseUrl}%22%2Cy%3D%22${parameters}%22%2CI%3D(l%3Dwindow.getSelection())%3D%3D%3Dnull%7C%7Cl%3D%3D%3Dvoid%200%3Fvoid%200%3Al.toString()%3Bif(I!%3D%3D%22%22)return%20window.open(%22%22.concat(g%2C%22%26rft_id%3Dinfo%3Adoi%2F%22).concat(I).concat(y))%3Bvar%20h%3DU()%3Breturn%20h%3Fwindow.open(%22%22.concat(g).concat(h).concat(y))%3Aalert(%22I%20did%20not%20find%20enough%20metadata%20to%20locate%20this%20article%20automatically.%20If%20you%20see%20the%20DOI%20for%20this%20article%20on%20the%20page%2C%20select%20it%20with%20your%20mouse%20and%20click%20this%20bookmarklet%20again%22)%7D)()%3B`;
    setBookmarklet(bookmarkletFunction);
  }

  function testLinkResolver() {
    try {
      window.open(
        `${baseUrl}rft_id=info:doi/10.1136/bmj.331.7531.1498${parameters ?? ""}`,
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="w-md md:w-xl mx-auto my-20">
      <h1 className="text-2xl my-5">Create an OpenURL Bookmarklet</h1>

      <fieldset className="fieldset">
        <label className="label">Link resolver base URL</label>
        <input
          required
          type="url"
          className="input w-full validator"
          placeholder="https://library.example.edu/openurl?"
          pattern="https?://.+\?"
          onChange={handleBaseUrlChange}
        />
        <p>
          Check your link resolver documentation for details. Base URL should
          end in "?".
        </p>

        <label className="label mt-3">Bookmarklet title</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Find@MyLibrary"
          onChange={handleTitleChange}
        />
      </fieldset>
      <div className="mt-3 collapse collapse-plus bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title">Advanced settings</div>
        <div className="collapse-content">
          <fieldset className="fieldset">
            <label className="label">Additional URL parameters</label>
            <input
              type="text"
              className="input w-full validator"
              placeholder="&parameter=value"
              pattern="&.*"
              onChange={handleParametersChange}
            />
            <p>
              Parameters will be appended to the OpenURL. Parameter should begin
              with "&".
            </p>
          </fieldset>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="button"
          className="btn btn-soft  my-5 w-1/3"
          onClick={testLinkResolver}
          disabled={!baseUrl}
          value="Test Link Resolver"
        />
        <input
          type="button"
          className="btn btn-soft btn-primary my-5 w-2/3"
          onClick={createBookmarklet}
          disabled={!baseUrl}
          value="Create Bookmarklet"
        />
      </div>

      <BookmarkletPreview />
    </div>
  );
}

export default App;
