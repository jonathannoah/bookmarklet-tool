// src/App.tsx

import { useEffect, useRef, useState } from "react";
import bookmarkletTemplate from "./bookmarklet.js?raw";

const addBodyClass = (className: string) =>
  document.body.classList.add(className);
const removeBodyClass = (className: string) =>
  document.body.classList.remove(className);

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const demo: boolean = queryParams.get("demo") === "";

  useZoomBody(demo);

  function useZoomBody(demo: boolean) {
    useEffect(() => {
      if (demo) {
        addBodyClass("zoom");
        return () => {
          removeBodyClass("zoom");
        };
      }
    }, [demo]);
  }

  const [baseUrl, setBaseUrl] = useState<string>(
    demo ? "https://samhealth.tdnetdiscover.com/resolver" : "",
  );
  const [bookmarklet, setBookmarklet] = useState<string>();
  const [title, setTitle] = useState<string>(demo ? "Find@SamLib" : "");
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

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="link link-hover text-lg px-5">
            Library Link Resolver Bookmarklet Tool
          </a>
        </div>
        <div className="flex-none">
          <a
            href="https://github.com/jonathannoah/bookmarklet-tool"
            className="btn btn-square btn-ghost"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              viewBox="0 0 20 20"
              className="size-5 fill-black/40 dark:fill-gray-400"
            >
              <path d="M10 0C4.475 0 0 4.475 0 10a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.287-.6-1.175-1.025-1.412-.35-.188-.85-.65-.013-.663.788-.013 1.35.725 1.538 1.025.9 1.512 2.337 1.087 2.912.825.088-.65.35-1.088.638-1.338-2.225-.25-4.55-1.112-4.55-4.937 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.274.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0020 10c0-5.525-4.475-10-10-10z"></path>
            </svg>
          </a>
        </div>
      </div>
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
            defaultValue={
              demo ? "https://samhealth.tdnetdiscover.com/resolver" : ""
            }
          />
          <p>Check your link resolver documentation for details.</p>

          <label className="label mt-3">Bookmarklet title</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Find@MyLibrary"
            onChange={handleTitleChange}
            defaultValue={demo ? "Find@SamLib" : ""}
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
    </>
  );
}
