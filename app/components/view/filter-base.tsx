import { Box, Button, chakra, Flex, HStack, VStack } from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import * as React from "react";
import { useFilter } from "~/headless/edit-filter/use-filter";

export default function FilterBase() {
  const filter = useFilter();

  return (
    <Form {...filter.getFormProps({})}>
      <chakra.fieldset {...filter.getFieldsetProps()}>
        <Box>
          <VStack
            mb="2"
            display="flex"
            flexDirection="column"
            spacing="1"
            textColor="gray.900"
          >
            <Flex h="2rem">
              <Flex w="4.5rem" flex="1 1 auto" alignItems="center" px="2">
                Where
              </Flex>
              <Box mr="2" flex="1 1 auto"></Box>
            </Flex>
          </VStack>
          <HStack alignItems="center" spacing="4">
            <Box flex="none">
              <Button variant="link" {...filter.getAddConditionButtonProps()}>
                Добавить условие
              </Button>
            </Box>
            <Box flex="none"></Box>
          </HStack>
        </Box>
      </chakra.fieldset>
    </Form>
  );
}
