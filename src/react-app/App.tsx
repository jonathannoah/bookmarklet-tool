// src/App.tsx

import { useEffect, useRef, useState } from "react";
import bookmarkletTemplate from "./bookmarklet.js?raw";

const addBodyClass = (className: string) =>
  document.body.classList.add(className);
const removeBodyClass = (className: string) =>
  document.body.classList.remove(className);

function useZoomBody(zoom: boolean) {
  useEffect(() => {
    if (zoom) {
      addBodyClass("zoom");
      return () => {
        removeBodyClass("zoom");
      };
    }
  }, [zoom]);
}

export default function App() {
  const [baseUrl, setBaseUrl] = useState<string>();
  const [bookmarklet, setBookmarklet] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [parameters, setParameters] = useState<string>();

  const bookmarkletCodeRef:
    | React.RefObject<HTMLTextAreaElement>
    | React.RefObject<null> = useRef(null);

  const bookmarkletUrlRef:
    | React.RefObject<HTMLTextAreaElement>
    | React.RefObject<null> = useRef(null);

  const bookmarkletText =
    'Drag this link to your browser\'s bookmark toolbar or favorites bar. Click "save" if prompted.';

  function selectAllText(
    ref: React.RefObject<HTMLTextAreaElement> | React.RefObject<null>,
  ) {
    if (ref.current) {
      ref.current.select();
    }
  }

  function BookmarkletPreview() {
    return (
      <>
        <h2 className="text-xl mb-5">Preview</h2>
        <div
          className="card w-3/4 bg-base-200 shadow-md p-10 mx-auto"
          dangerouslySetInnerHTML={createBookmarkletPreview()}
        />
        <fieldset className="fieldset mt-3">
          <label className="label">Bookmarklet embed code</label>
          <textarea
            ref={bookmarkletCodeRef}
            value={createBookmarkletEmbed().__html}
            onClick={() => selectAllText(bookmarkletCodeRef)}
            readOnly
            className="textarea w-full h-72 "
          />
          <p>Copy the code above to add this bookmarklet to your webpage.</p>

          <label className="label mt-3">Bookmarklet URL</label>
          <textarea
            ref={bookmarkletUrlRef}
            value={bookmarklet}
            onClick={() => selectAllText(bookmarkletUrlRef)}
            readOnly
            className="textarea w-full h-40 "
          />
          <p>
            Use this URL as a link <code>href</code> to create your own
            bookmarklet link.
          </p>
        </fieldset>
      </>
    );
  }

  function createBookmarkletPreview() {
    return {
      __html: `<a href="${bookmarklet ?? ""}" class="link link-info" ${!bookmarklet ? "disabled" : ""}>${title ?? "Find@MyLibrary"}</a><p class="mt-2">${bookmarkletText}</p>`,
    };
  }

  function createBookmarkletEmbed() {
    return {
      __html: `<a href="${bookmarklet ?? ""}">${title ?? "Find@MyLibrary"}</a><p>${bookmarkletText}</p>`,
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

    const bookmarkletReplacements = [
      ["%BASE%", baseUrl],
      ["%PARAMS%", parameters],
    ];

    const composedBookmarklet = bookmarkletReplacements.reduce(
      (acc, [oldStr, newStr]) => {
        return acc.replace(oldStr ?? "", newStr ?? "");
      },
      bookmarkletTemplate,
    );

    const bookmarkletFunction = `javascript:${encodeURIComponent(composedBookmarklet as string)}`;
    setBookmarklet(bookmarkletFunction);
  }

  function testLinkResolver() {
    const testUrl = new URL(baseUrl ?? "");
    const testParams = new URLSearchParams(parameters);

    testParams.forEach((value, key) => testUrl.searchParams.append(key, value));

    testUrl.searchParams.append("rft_id", "info:doi/10.1136/bmj.331.7531.1498");
    testUrl.searchParams.append("ctx_ver", "Z39.88-2004");
    testUrl.searchParams.append("rft_val_fmt", "info:ofi/fmt:kev:mtx:journal");

    try {
      window.open(testUrl.href, "_blank");
    } catch (e) {
      console.log(e);
    }
  }

  const queryParams = new URLSearchParams(window.location.search);
  const zoom = queryParams.get("zoom") == "";
  useZoomBody(zoom);

  return (
    <div className="w-md md:w-xl mx-auto my-20">
      <h1 className="text-2xl my-5">Create an OpenURL Bookmarklet</h1>

      <fieldset className="fieldset">
        <label className="label">OpenURL link resolver base URL</label>
        <input
          required
          type="url"
          className="input w-full validator"
          placeholder="https://library.example.com/openurl?"
          onChange={handleBaseUrlChange}
        />
        <p>Check your link resolver documentation for details.</p>

        <label className="label mt-3">Bookmarklet title</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Find@MyLibrary"
          onChange={handleTitleChange}
        />
      </fieldset>
      <div className="mt-3 collapse collapse-plus bg-base-100 border-[var(--color-base-content)]/20 border">
        <input type="checkbox" />
        <div className="collapse-title">Advanced settings</div>
        <div className="collapse-content">
          <fieldset className="fieldset">
            <label className="label">Additional URL parameters</label>
            <input
              type="text"
              className="input w-full validator"
              placeholder="&parameter_1=value_1&parameter_2=value_2"
              onChange={handleParametersChange}
            />
            <p>Parameters will be appended to the OpenURL.</p>
          </fieldset>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="button"
          className="btn btn-soft my-5 w-1/3"
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

      {/* eslint-disable-next-line react-hooks/static-components */}
      {bookmarklet && <BookmarkletPreview />}
    </div>
  );
}
