import { Badge as DefaultBadge, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { IBadge } from "./Badge";

interface IBadgeGroup {
  items: IBadge["map"];
  onChange?: (value: string[]) => void;
}

const Badge = styled(DefaultBadge)`
  cursor: pointer;
`;

export default function BadgeGroup(props: IBadgeGroup) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(selected);
    }
  }, [selected, props.onChange]);

  return (
    <Flex gap="2" align="center">
      {Object.keys(props.items).map((key) => {
        const { label, color } = props.items[key];
        return (
          <Badge
            key={key}
            variant={selected.includes(key) ? "solid" : "outline"}
            color={color}
            onClick={() => {
              const index = selected.indexOf(key);
              if (index > -1) {
                selected.splice(index, 1);
              } else {
                selected.push(key);
              }

              setSelected([...selected]);
            }}
          >
            {label}
          </Badge>
        );
      })}
    </Flex>
  );
}
