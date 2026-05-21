import type { FieldPlugin } from './types'
import { textPlugin } from './text.plugin'
import { emailPlugin } from './email.plugin'
import { textareaPlugin } from './textarea.plugin'
import { selectPlugin } from './select.plugin'
import { checkboxPlugin } from './checkbox.plugin'
import { passwordPlugin } from './password.plugin'
import { otpPlugin } from './otp.plugin'
import { radioPlugin } from './radio.plugin'
import { checkboxGroupPlugin } from './checkbox-group.plugin'
import { switchPlugin } from './switch.plugin'
import { sliderPlugin } from './slider.plugin'
import { multiSelectPlugin } from './multi-select.plugin'
import { phonePlugin } from './phone.plugin'
import { maskedTimePlugin } from './masked-time.plugin'
import { numberStepperPlugin } from './number-stepper.plugin'
import { cardDetailsPlugin } from './card-details.plugin'

function createFieldRegistry() {
  const plugins = new Map<string, FieldPlugin>()

  return {
    register(plugin: FieldPlugin): void {
      plugins.set(plugin.type, plugin)
    },
    get(type: string): FieldPlugin {
      const plugin = plugins.get(type)
      if (!plugin) {
        throw new Error(
          `Unknown field type: "${type}". Available types: ${Array.from(plugins.keys()).join(', ')}`
        )
      }
      return plugin
    },
    has(type: string): boolean {
      return plugins.has(type)
    },
    types(): string[] {
      return Array.from(plugins.keys())
    },
  }
}

const registry = createFieldRegistry()
registry.register(textPlugin)
registry.register(emailPlugin)
registry.register(textareaPlugin)
registry.register(selectPlugin)
registry.register(checkboxPlugin)
registry.register(passwordPlugin)
registry.register(otpPlugin)
registry.register(radioPlugin)
registry.register(checkboxGroupPlugin)
registry.register(switchPlugin)
registry.register(sliderPlugin)
registry.register(multiSelectPlugin)
registry.register(phonePlugin)
registry.register(maskedTimePlugin)
registry.register(numberStepperPlugin)
registry.register(cardDetailsPlugin)

export const fieldRegistry = registry
