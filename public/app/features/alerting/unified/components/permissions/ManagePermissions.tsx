import { useState, ComponentProps } from 'react';

import { Button, Drawer } from '@grafana/ui';
import { Permissions } from 'app/core/components/AccessControl';

type ButtonProps = { onClick: () => void };

type BaseProps = Pick<ComponentProps<typeof Permissions>, 'resource' | 'resourceId'> & {
  resourceName?: string;
  title?: string;
};

type Props = BaseProps & {
  renderButton?: (props: ButtonProps) => JSX.Element;
};

/**
 * Renders just the drawer containing permissions management for the resource.
 *
 * Useful for manually controlling the state/display of the drawer when you need to render the
 * controlling button within a dropdown etc.
 */
export const ManagePermissionsDrawer = ({
  resource,
  resourceId,
  resourceName,
  title,
  onClose,
}: BaseProps & Pick<ComponentProps<typeof Drawer>, 'onClose'>) => (
  <Drawer onClose={onClose} title={title || 'Manage permissions'} subtitle={resourceName}>
    <Permissions resource={resource} resourceId={resourceId} canSetPermissions></Permissions>
  </Drawer>
);

/** Default way to render the button for "manage permissions" */
const DefaultButton = ({ onClick }: ButtonProps) => {
  return (
    <Button variant="secondary" onClick={onClick} icon="unlock">
      Manage permissions
    </Button>
  );
};

/**
 * Renders a button that opens a drawer with the permissions editor.
 *
 * Provides capability to render button as custom component, and manages open/close state internally
 */
const ManagePermissions = ({ resource, resourceId, resourceName, title, renderButton }: Props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const closeDrawer = () => setShowDrawer(false);
  const openDrawer = () => setShowDrawer(true);

  return (
    <>
      {renderButton ? renderButton({ onClick: openDrawer }) : <DefaultButton onClick={openDrawer} />}
      {showDrawer && (
        <ManagePermissionsDrawer
          resource={resource}
          resourceId={resourceId}
          resourceName={resourceName}
          title={title}
          onClose={closeDrawer}
        />
      )}
    </>
  );
};

export default ManagePermissions;
