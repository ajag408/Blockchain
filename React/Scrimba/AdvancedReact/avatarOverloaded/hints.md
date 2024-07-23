Some logic to follow:

If there's a `src` prop being passed in, render a div
with an <img /> child. Use the `src` from props as the
src for your <img /> element.

If there's children passed in, render a div with those
children passed in.

In all other cases, render a div with the 
<IoPersonSharp /> component as a child.