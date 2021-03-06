<template>
  <div class="container">
    <SfButton
      v-for="lang in availableLocales"
      :key="lang.name"
      :class="['container__lang', { 'container__lang--selected': lang.name === locale}]"
      @click="handleChangeLang(lang)"
    >
      <SfImage :src="`/icons/langs/${lang.name}.png`" width="20" />
    </SfButton>
    <SfSelect v-model="country" class="container__select">
      <SfSelectOption v-for="currentCountry in availableCountries" :key="currentCountry.name" :value="currentCountry.name">
        <div>{{ currentCountry.label }}</div>
      </SfSelectOption>
    </SfSelect>
    <SfSelect v-model="currency" class="container__select">
      <SfSelectOption v-for="currentCurrency in availableCurrencies" :key="currentCurrency.name" :value="currentCurrency.name">
        <div>{{ currentCurrency.label }}</div>
      </SfSelectOption>
    </SfSelect>
  </div>
</template>

<script>
import { SfButton, SfImage, SfSelect } from '@storefront-ui/vue';
import { useLocale } from '<%= options.composables %>';

export default {
  components: {
    SfButton,
    SfImage,
    SfSelect
  },
  setup(props, context) {
    const { $i18n, $router, $route } = context.root;
    const { locale, ...fields } = useLocale();
    const setCookie = $i18n.setLocaleCookie;

    const handleChangeLang = ({ name }) => {
      locale.value = name;
      setCookie(name);
      $router.go({ path: $route.fullPath,
        force: true });
    };

    return {
      handleChangeLang,
      locale,
      ...fields
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.container {
  margin: 0 -5px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &::v-deep .sf-select {
    --select-font-size: var(--font-size-small);
  }

  &__select {
    padding: 0 5px;
    margin: 0;
    cursor: pointer;

    &::v-deep .sf-select__dropdown {
      min-width: 150px;
    }

    &::v-deep .sf-select__selected {
      padding: 0;
      display: flex;
      align-items: center;
    }
  }

  &__lang {
    --image-width: 20px;
    background: none;
    padding: 0 5px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    border: none;

    &:hover,
    &--selected {
      opacity: 1;
    }
  }
}

</style>
