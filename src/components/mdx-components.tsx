import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import { slugify as transliterate } from "transliteration";
import {
  Accordion,
  AccordionGroup,
  Button,
  Card,
  CodeBlock,
  Column,
  Feedback,
  Grid,
  Heading,
  HeadingLink,
  Icon,
  InlineCode,
  Line,
  List,
  ListItem,
  Media,
  type MediaProps,
  Row,
  SmartLink,
  Table,
  Text,
  type TextProps,
} from "@once-ui-system/core";

type CustomLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      border="neutral-alpha-medium"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={src}
      {...props}
    />
  );
}

function slugify(str: string): string {
  const strWithAnd = str.replace(/&/g, " and ");
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-",
  }).replace(/\-\-+/g, "-");
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: {
  children?: {
    props?: {
      className?: string;
      children?: string;
    };
  };
}) {
  if (props.children?.props?.className) {
    const { className, children } = props.children.props;
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children ?? "",
            language,
            label,
          },
        ]}
        copyButton
      />
    );
  }

  return <pre>{props.children as ReactNode}</pre>;
}

function createList(as: "ul" | "ol") {
  return ({ children }: { children: ReactNode }) => <List as={as}>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem marginTop="4" marginBottom="8" style={{ lineHeight: "175%" }}>
      {children}
    </ListItem>
  );
}

function createHR() {
  return (
    <Row fillWidth horizontal="center">
      <Line maxWidth="40" />
    </Row>
  );
}

export const mdxComponents = {
  p: createParagraph as never,
  h1: createHeading("h1") as never,
  h2: createHeading("h2") as never,
  h3: createHeading("h3") as never,
  h4: createHeading("h4") as never,
  h5: createHeading("h5") as never,
  h6: createHeading("h6") as never,
  img: createImage as never,
  a: CustomLink as never,
  code: createInlineCode as never,
  pre: createCodeBlock as never,
  ol: createList("ol") as never,
  ul: createList("ul") as never,
  li: createListItem as never,
  hr: createHR as never,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
};
