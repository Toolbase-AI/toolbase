import {
  Button,
  Group,
  InputWrapper,
  Modal,
  Pill,
  Stack,
  TagsInput,
  Text,
  TextInput,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useServerConfigs } from '../providers/ServerConfigsProvider';
import { type MCPServer } from '../types/types';

interface EditModalProps {
  server: MCPServer;
  opened: boolean;
  onClose: () => void;
  centered?: boolean;
}

export function EditModal({
  server,
  opened,
  onClose,
  centered,
}: EditModalProps) {
  const { serverConfigs, setServerConfig } = useServerConfigs();

  const serverConfig = serverConfigs[server.id];

  const initialEnvVars = Object.entries(server.envVariables ?? {}).reduce<
    Record<string, string>
  >((initialEnv, [envName]) => {
    initialEnv[envName] = '';
    return initialEnv;
  }, {});

  const initialCustomArgs = Object.entries(server.customArgs ?? {}).reduce<
    Record<string, string | string[]>
  >((initialCustomArgs, [argName, argConfig]) => {
    initialCustomArgs[argName] = argConfig.type === 'string' ? '' : [];
    return initialCustomArgs;
  }, {});

  const validateEnvVars = Object.entries(server.envVariables ?? {}).reduce<
    Record<string, ReturnType<typeof isNotEmpty> | undefined>
  >((validateEnvVars, [envName, envConfig]) => {
    validateEnvVars[envName] = envConfig.required
      ? isNotEmpty('This field is required')
      : undefined;
    return validateEnvVars;
  }, {});

  const validateCustomArgs = Object.entries(server.customArgs ?? {}).reduce<
    Record<string, ReturnType<typeof isNotEmpty> | undefined>
  >((validateCustomArgs, [argName, argConfig]) => {
    validateCustomArgs[argName] = argConfig.required
      ? isNotEmpty('This field is required')
      : undefined;
    return validateCustomArgs;
  }, {});

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      envVariables: initialEnvVars,
      customArgs: initialCustomArgs,
    },
    validate: {
      envVariables: validateEnvVars,
      customArgs: validateCustomArgs,
    },
  });

  useEffect(() => {
    if (serverConfig) {
      form.setValues(serverConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverConfig]);

  const handleSubmit = form.onSubmit((values) => {
    setServerConfig(server.id, values).catch(() => {});
    onClose();
  });

  const hasEnvVariables =
    !!server.envVariables && Object.keys(server.envVariables).length > 0;

  const hasCustomArg =
    !!server.customArgs && Object.keys(server.customArgs).length > 0;

  const hasSettings = hasEnvVariables || hasCustomArg;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Settings"
      centered={centered}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {hasEnvVariables &&
            Object.entries(server.envVariables ?? {}).map(
              ([envName, config]) => (
                <TextInput
                  {...form.getInputProps(`envVariables.${envName}`)}
                  key={form.key(`envVariables.${envName}`)}
                  label={config.title || envName}
                  description={config.description}
                  withAsterisk={config.required}
                />
              ),
            )}
          {hasCustomArg &&
            Object.entries(server.customArgs ?? {}).map(([argName, config]) => {
              if (config.type === 'string') {
                return (
                  <TextInput
                    {...form.getInputProps(`customArgs.${argName}`)}
                    key={form.key(`customArgs.${argName}`)}
                    label={config.title || argName}
                    description={config.description}
                    withAsterisk={config.required}
                  />
                );
              }

              if (config.type === 'strings') {
                return (
                  <TagsInput
                    {...form.getInputProps(`customArgs.${argName}`)}
                    key={form.key(`customArgs.${argName}`)}
                    label={config.title || argName}
                    description={config.description}
                    withAsterisk={config.required}
                    placeholder="Enter an item"
                  />
                );
              }

              const selectedFolders = form.getValues().customArgs[argName];

              if (!selectedFolders || typeof selectedFolders === 'string') {
                return null;
              }

              return (
                <InputWrapper
                  key={form.key(`customArgs.${argName}`)}
                  label={config.title || argName}
                  description={config.description}
                  withAsterisk={config.required}
                >
                  <Stack align="center" mt="sm">
                    {selectedFolders.length === 0 ? (
                      <Text
                        size="xs"
                        color={
                          form.errors[`customArgs.${argName}`]
                            ? 'red'
                            : 'dimmed'
                        }
                      >
                        No folders selected
                      </Text>
                    ) : (
                      <Stack
                        style={{ alignSelf: 'flex-start' }}
                        align="flex-start"
                      >
                        {selectedFolders.map((folder) => (
                          <Pill
                            key={folder}
                            size="xs"
                            withRemoveButton
                            onRemove={() =>
                              form.setFieldValue(
                                `customArgs.${argName}`,
                                selectedFolders.filter((f) => f !== folder),
                              )
                            }
                          >
                            {folder}
                          </Pill>
                        ))}
                      </Stack>
                    )}

                    <Button
                      size="compact-xs"
                      variant="light"
                      onClick={async () => {
                        const newFolders =
                          await window.electronAPI.openDirectories();
                        const noDups = newFolders.filter(
                          (newFolder) => !selectedFolders.includes(newFolder),
                        );

                        form.setFieldValue(`customArgs.${argName}`, [
                          ...selectedFolders,
                          ...noDups,
                        ]);
                      }}
                    >
                      Select folders
                    </Button>
                  </Stack>
                </InputWrapper>
              );
            })}
          {!hasSettings && (
            <Text c="dimmed">No settings are needed for this server.</Text>
          )}
          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={onClose}>
              {hasSettings ? 'Cancel' : 'Close'}
            </Button>
            {hasSettings && <Button type="submit">Save</Button>}
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
