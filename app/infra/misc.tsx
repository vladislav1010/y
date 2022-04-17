import * as React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

const AnchorOrLink = React.forwardRef<
  HTMLAnchorElement,
  AnchorProps & {
    reload?: boolean;
    to?: LinkProps["to"];
    prefetch?: LinkProps["prefetch"];
  }
>(function AnchorOrLink(props, ref) {
  const {
    to,
    href,
    download,
    reload = false,
    prefetch,
    children,
    ...rest
  } = props;
  let toUrl = "";
  let shouldUserRegularAnchor = reload || download;

  if (!shouldUserRegularAnchor && typeof href === "string") {
    shouldUserRegularAnchor = href.includes(":") || href.startsWith("#");
  }

  if (!shouldUserRegularAnchor && typeof to === "string") {
    toUrl = to;
    shouldUserRegularAnchor = to.includes(":");
  }

  if (!shouldUserRegularAnchor && typeof to === "object") {
    toUrl = `${to.pathname ?? ""}${to.hash ? `#${to.hash}` : ""}${
      to.search ? `?${to.search}` : ""
    }`;
    shouldUserRegularAnchor = to.pathname?.includes(":");
  }

  if (shouldUserRegularAnchor) {
    return (
      <a {...rest} download={download} href={href ?? toUrl} ref={ref}>
        {children}
      </a>
    );
  } else {
    return (
      <Link prefetch={prefetch} to={to ?? href ?? ""} {...rest} ref={ref}>
        {children}
      </Link>
    );
  }
});

function tuple<T extends Array<any>>(items: [...T]) {
  return items;
}

/**
 *
 * @param value Can be null, undefined only in the first render
 */
function usePromiseNotNullUndefined<T>(value?: T | null) {
  const [prevResValue, setPrevResValue] = React.useState<T | null>(null);
  const [res, setRes] = React.useState<(value: T) => void>(null!);
  const [promise, setPromise] = React.useState(
    () =>
      new Promise<T>((_res) => {
        setRes(_res);
      })
  );

  React.useEffect(() => {
    if (value == null) {
      return;
    }

    if (prevResValue != null) {
      let res: (value: T) => void;
      let promise: Promise<T>;
      promise = new Promise((_res) => {
        res = _res;
        setRes(_res);
      });

      setPromise(promise);

      // @ts-expect-error
      res(value);
    } else {
      res(value);
    }

    setPrevResValue(value);
  }, [prevResValue, res, value]);

  return promise;
}

export { AnchorOrLink, tuple, usePromiseNotNullUndefined };
