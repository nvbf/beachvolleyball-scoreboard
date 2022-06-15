import { addHomeTeam } from "./actions";
import { teamsSagas } from "./sagas";
import { baseState, testSagaWithRedux } from "../utils/testSaga";

// const ints = [
//   {
//     name: "lol",
//     id: "2",
//     provider: "ayy",
//     added: "nowwww",
//   },
//   {
//     name: "lol",
//     id: "432132445",
//     provider: "ayy",
//     added: "nowwww",
//   },
//   {
//     name: "lol",
//     id: "4312341",
//     provider: "ayy",
//     added: "nowwww",
//   },
//   {
//     name: "lol",
//     id: "1232k",
//     provider: "ayy",
//     added: "nowwww",
//   },
// ]

// const integration = {   
//   name: "lol",
//   id: "4312341",
//   provider: "ayy",
//   added: "nowwww"
// }

const state = "eyJ0b2tlbiI6InRoaXMudG9rZW4uaGVyZSIsInByb3ZpZGVyIjoiR29vZ2xlRHJpdmUiLCJpbnRlZ3JhdGlvbklEIjoiIn0="


// describe("getIntegrationsSaga", () => {
//   test("should resolve the integrations from API, and set them in state", () => testSagaWithRedux(
//     integrationSagas,
//     (_: string) => Promise.resolve(ints),
//     (_: IntegrationSaveRequest) => Promise.resolve(integration),
//     )
//     .dispatch(fetchIntegrationsStart("fake-token"))
//     .hasFinalState({
//       ...baseState,
//       integrations: {
//         ...baseState.integrations,
//         integrations: ints,
//         errorMessage: null,
//         updating: false
//       }
//     })
//     .silentRun()
//   )

//   test("should set an error in state if the api request fails", () => {
//     const err = errGenericError
//     return testSagaWithRedux(
//       integrationSagas, 
//         (_: string) => Promise.reject(err)
//       )
//       .dispatch(fetchIntegrationsStart("fake-token"))
//       .hasFinalState({
//         ...baseState,
//         integrations: {
//           ...baseState.integrations,
//           errorMessage: err,
//           updating: false
//         }
//       })
//       .silentRun()
//   })
// })

// describe("createIntegrationSaga", () => {
//   test("sent createIntegration to API with no errors", () => testSagaWithRedux(
//     integrationSagas,
//     (_: string) => Promise.resolve([]),
//     (_: IntegrationSaveRequest) => Promise.resolve(integration),
//     )
//     .dispatch(saveIntegration({
//       token: "fake-token",
//       integration: {
//         state: state, scope: "GoogleDriveScope", code: "ABCD", name: "intName"
//       },
//       subPath: "google"
//     }))
//     .hasFinalState({
//       ...baseState,
//       integrations: {
//         ...baseState.integrations,
//         errorMessage: null,
//         updating: false
//       }
//     })
//     .silentRun()
//   )

//   test("should set an error in state if the api request fails", () => {
//     const err = errIntAlreadyAdded
//     return testSagaWithRedux(
//       integrationSagas,
//       (_: string) => Promise.resolve([]),
//       (_: IntegrationSaveRequest) => Promise.reject(err),
//       )
//       .dispatch(saveIntegration({
//         token: "fake-token",
//         integration: {
//           state: state, scope: "GoogleDriveScope", code: "ABCD", name: "intName"
//         },
//         subPath: "google"
//       }))
//       .hasFinalState({
//         ...baseState,
//         integrations: {
//           ...baseState.integrations,
//           integrations: [],
//           errorMessage: err
//         }
//       })
//       .silentRun()
//   })
// })

