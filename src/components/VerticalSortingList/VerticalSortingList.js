import { useEffect, useState } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  Stack,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { L } from '../L';


const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    // eslint-disable-next-line react/forbid-dom-props
    <div ref={ setNodeRef } style={ style } { ...attributes } { ...listeners }>
      {props.itemElement ? (
        <props.itemElement item={ props.item } /> 
      ) : (
        <L.div
          sx={{
            backgroundColor: 'white',
            border: '2px dotted grey',
            borderRadius: '5px',
            cursor: 'grab',
            marginY: 0.5,
            padding: 1,
            paddingRight: 3.5,
            textAlign: 'center',
            touchAction: 'none',
            position: 'relative',
            boxShadow: '1px 2px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ':active': {
              cursor: 'grabbing',
            },
            ...props.itemSx,
          }}
        >
          <DragIndicatorIcon
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          { props.item.name }
        </L.div>
      )}
    </div>
  );
};


export const VerticalSortingList = (props) => {
  const { initialItemList, onListChange, itemElement, itemSx } = props;
  const [ listItems, setListItems ] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (Array.isArray(initialItemList)) {
      setListItems(initialItemList);
    }
  }, [ initialItemList ]);

  useEffect(() => {
    if (Array.isArray(listItems)) {
      onListChange(listItems);
    }
  }, [ listItems, setListItems, onListChange ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext 
      sensors={ sensors }
      collisionDetection={ closestCenter }
      modifiers={ [ restrictToVerticalAxis ] }
      onDragEnd={ handleDragEnd }
    >
      <SortableContext 
        items={ listItems }
        strategy={ verticalListSortingStrategy }
      >
        <Stack>
          {listItems.map(item => (
            <SortableItem
              key={ item.id }
              id={ item.id }
              item={ item }
              itemElement={ itemElement }
              itemSx={ itemSx }
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};
