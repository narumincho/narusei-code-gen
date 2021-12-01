import * as React from "react";
import { Story, Meta } from "@storybook/react";

import { COMPONENTTEMPLATE } from ".";

const meta: Meta = {
  title: "component/COMPONENTFILEPATH",
  component: COMPONENTTEMPLATE,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};
export default meta;

const Template: Story = (args) => <COMPONENTTEMPLATE {...args} />;

export const Default: Story = Template.bind({});
Default.args = {};
