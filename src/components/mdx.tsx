import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx-components";

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof mdxComponents;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      options={{ blockJS: false }}
      {...props}
      components={{ ...mdxComponents, ...(props.components || {}) }}
    />
  );
}
