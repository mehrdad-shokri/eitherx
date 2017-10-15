import React from 'react'
import Eitherx from '../dist/eitherx.cjs.js'
import renderer from 'react-test-renderer';

test('should throw if < 1 or > 2 children are passed', () => {
  expect(() => renderer.create(<Eitherx></Eitherx>))
    .toThrowErrorMatchingSnapshot()
  expect(() => renderer.create(<Eitherx><div/><div/><div/></Eitherx>))
    .toThrowErrorMatchingSnapshot()
})

test('should throw render is passed but not handleErrors', () => {
  expect(() => renderer.create(
    <Eitherx
      render={() => (<div/>)}
    />
  )).toThrowErrorMatchingSnapshot()
})

test('should throw if render or handleErrors is not a function', () => {
  expect(() => renderer.create(
    <Eitherx
      render={() => (<div/>)}
      handleErrors={"Not a function"}
    />
  )).toThrowErrorMatchingSnapshot()

  expect(() => renderer.create(
    <Eitherx
      render={"Not a function"}
      handleErrors={() => (<div/>)}
    />
  )).toThrowErrorMatchingSnapshot()
})

class ErrorComponent extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    throw new Error('Test Error')
  }
}

test('should return null if no error handler is passed, and error is thrown', () => {
  let component = renderer.create(
    <Eitherx>
      <p>My Paragraph</p>
    </Eitherx>
  )
  expect(component.toJSON()).toMatchSnapshot();

  component = renderer.create(
    <Eitherx>
      <ErrorComponent>"My Error"</ErrorComponent>
    </Eitherx>
  )
  expect(component.toJSON()).toEqual(null);
})

test('should render second component on error', () => {
  let component = renderer.create(
    <Eitherx>
      <p>"Happy Child 😄"</p>
      <p>"Error as child ☹️"</p>
    </Eitherx>
  )
  expect(component.toJSON()).toMatchSnapshot();

  component = renderer.create(
    <Eitherx>
      <ErrorComponent>"Function as child 😄"</ErrorComponent>
      <p>"Error as child ☹️"</p>
    </Eitherx>
  )
  expect(component.toJSON()).toMatchSnapshot();
})

test('should work with render-catch props as well', () => {
  let component = renderer.create(
    <Eitherx
      render={() => (<p>"Render Prop"</p>)}
      handleErrors={() => (<p>"Catch Prop"</p>)}
    />
  )
  expect(component.toJSON()).toMatchSnapshot();

  component = renderer.create(
    <Eitherx
      render={() => (<ErrorComponent>"Render Prop"</ErrorComponent>)}
      handleErrors={() => (<p>"Catch Prop"</p>)}
    />
  )
  expect(component.toJSON()).toMatchSnapshot();
})
