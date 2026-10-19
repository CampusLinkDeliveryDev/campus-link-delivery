import {test, expect} from 'vitest'
import {render} from '@testing-library/react'
import App from "./App"


test("App renders", () => {
    const {container} = render(<App />)
    expect(container.firstChild).not.toBeNull()
})