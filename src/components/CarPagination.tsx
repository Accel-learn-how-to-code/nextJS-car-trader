import { getAsString } from "../getAsString";
import { useRouter } from "next/router";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { PaginationRenderItemParams } from "@material-ui/lab";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { forwardRef } from "react";

export function CarPagination({ totalPages }: { totalPages: number }) {
  const { query } = useRouter();
  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUILink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
}

export interface MaterialUILinkProps {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUILink = forwardRef<HTMLAnchorElement, MaterialUILinkProps>(
  ({ item, query, ...props }, ref) => (
    <Link
      href={{
        pathname: "/cars",
        query: { ...query, page: item.page },
      }}
      shallow
    >
      <a ref={ref} {...props}></a>
    </Link>
  )
);
