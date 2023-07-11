import ThemedButton from "@/components/ThemedButton";
import { Dialog } from "@headlessui/react";
import { FormField, default as Form } from "@/components/Form";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import TextButton from "@/components/TextButton";
import Permissions from "@/logic/permissions";

export default function AddAdminModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden={true} />
      <div
        className="fixed inset-0 flex items-center justify-center p-4 max-sm:px-0 max-sm:pb-0 max-sm:pt-12"
        aria-hidden={true}
      >
        <Dialog.Panel
          as={Form}
          method="post"
          className="relative card 3xl:w-7/12 md:w-2/3 flex flex-col max-h-full container mx-auto max-sm:rounded-b-none"
        >
          <div className="w-auto max-h-full flex flex-wrap -mx-6 px-6 overflow-y-auto">
            <TextButton
              as="button"
              noSubmit
              onClick={onClose}
              className="absolute top-8 right-8"
            >
              <CloseIcon width={24} />
            </TextButton>
            {/* {sent ? (
            <p className="font-20">
              Instructions to reset your password have been sent to your
              registered email
            </p>
          ) : (
            ""
          )} */}
            <Dialog.Title
              as="h1"
              className="text-primaryDark w-full font-40b mt-8 mb-4"
            >
              New Administrator Sign-up
            </Dialog.Title>
            {/* <Dialog.Description className="font-24 mb-4 text-center px-8">
            Enter your email below and we’ll send you a password link
          </Dialog.Description> */}
            <FormField
              name="name"
              className="mt-2 mb-6"
              placeholder="Name"
            ></FormField>

            <FormField
              name="email"
              width="w-5/12 flex-grow me-2"
              className="mt-2 mb-6"
              placeholder="Asssign email"
              type="text"
            ></FormField>
            <FormField
              name="password"
              width="w-5/12 flex-grow ms-2"
              className="mt-2 mb-6"
              placeholder="Assign password"
              type="password"
              autocomplete="new-password"
            ></FormField>
            <h4 className="font-32b w-full mt-4 mb-2">Permissions/access</h4>
            <div className="flex flex-wrap align-baseline">
              {Object.keys(Permissions.admin).map((e) => {
                return (
                  <div
                    key={e}
                    className="flex font-24 items-baseline w-1/2 max-sm:w-full"
                  >
                    <FormField
                      type="checkbox"
                      name={e}
                      className="mr-4"
                      value={false}
                    />
                    <label htmlFor={e}>{Permissions.admin[e].label}</label>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex justify-center">
              <ThemedButton
                variant="classic"
                bg="bg-primaryDark"
                className="mt-12 mb-2"
              >
                Create
              </ThemedButton>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
