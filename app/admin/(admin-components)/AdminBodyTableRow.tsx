import React from "react";
import { AdminBodyProductType, Selection } from "./AdminBodyShcn";
import SortableItem from "./SortableItem";

type Props = {
  finalListRender: AdminBodyProductType;
  data: AdminBodyProductType;
  setData: React.Dispatch<React.SetStateAction<AdminBodyProductType>>;
  selectedKeys: Selection;
  onValueChangeSelect: (e: boolean, id: number) => void;
  columns: (
    | {
        key: string;
        label: JSX.Element;
        visible: boolean;
        style: string;
      }
    | {
        key: string;
        label: string;
        visible: boolean;
        style: string;
      }
  )[];
  selectColumn: boolean;
};

const AdminBodyTableRow = React.memo(
  ({
    finalListRender,
    data,
    setData,
    selectedKeys,
    onValueChangeSelect,
    columns,
    selectColumn,
  }: Props) => {
    return (
      <React.Fragment>
        {finalListRender.map((item) => (
          <SortableItem
            key={item.sort_val.toString()} // Ensure key is a string and unique
            item={item}
            data={data}
            setData={setData}
            selectedKeys={selectedKeys}
            onValueChangeSelect={onValueChangeSelect}
            columns={columns}
            selectColumn={selectColumn}
          />
        ))}
      </React.Fragment>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.finalListRender === nextProps.finalListRender &&
      prevProps.columns === nextProps.columns
    ); // Implement deep comparison or more specific conditions if necessary
  },
);

AdminBodyTableRow.displayName = "AdminBodyTableRow";

export default AdminBodyTableRow;
