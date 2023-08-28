import { Badge as DefaultBadge, Flex } from "@radix-ui/themes";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";

type BadgeGroupItem = {
  id: number;
  name: string;
};

interface IBadgeGroup {
  items: BadgeGroupItem[];
  onChange?: (value: number[]) => void;
}

const Badge = styled(DefaultBadge)`
  cursor: pointer;
`;

export default function BadgeGroup(props: IBadgeGroup) {
  const [selected, setSelected] = useState<number[]>([]);

  const onClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      const { id: idStr } = e.currentTarget.dataset;
      if (idStr) {
        const id = parseInt(idStr, 10);
        const index = selected.indexOf(id);
        if (index > -1) {
          selected.splice(index, 1);
        } else {
          selected.push(id);
        }

        setSelected([...selected]);
      }
    },
    [selected]
  );

  useEffect(() => {
    if (props.onChange) {
      props.onChange(selected);
    }
  }, [selected, props]);

  return (
    <Flex gap="2" align="center">
      {props.items.map((item) => {
        const { id, name } = item;
        return (
          <Badge
            key={id}
            variant={selected.includes(id) ? "solid" : "outline"}
            data-id={id}
            onClick={onClick}
          >
            {name}
          </Badge>
        );
      })}
    </Flex>
  );
}
