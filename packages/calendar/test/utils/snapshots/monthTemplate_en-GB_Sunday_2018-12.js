const html = strings => strings[0];

export default html`
  <table aria-labelledby="month_and_year" aria-readonly="true" class="calendar__grid" role="grid">
    <thead id="calendar__thead">
      <tr>
        <th aria-label="Sunday" id="weekday1" scope="col">
          Sun
        </th>
        <th aria-label="Monday" id="weekday2" scope="col">
          Mon
        </th>
        <th aria-label="Tuesday" id="weekday3" scope="col">
          Tue
        </th>
        <th aria-label="Wednesday" id="weekday4" scope="col">
          Wed
        </th>
        <th aria-label="Thursday" id="weekday5" scope="col">
          Thu
        </th>
        <th aria-label="Friday" id="weekday6" scope="col">
          Fri
        </th>
        <th aria-label="Saturaday" id="weekday7" scope="col">
          Sat
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="calendar__day">
          <button
            aria-label="25"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            25
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="26"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            26
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="27"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            27
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="28"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            28
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="29"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            29
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="30"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            30
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="1" aria-selected="false" class="calendar__day-button" tabindex="-1">
            1
          </button>
        </td>
      </tr>
      <tr>
        <td class="calendar__day">
          <button aria-label="2" aria-selected="false" class="calendar__day-button" tabindex="-1">
            2
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="3" aria-selected="false" class="calendar__day-button" tabindex="-1">
            3
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="4" aria-selected="false" class="calendar__day-button" tabindex="-1">
            4
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="5" aria-selected="false" class="calendar__day-button" tabindex="-1">
            5
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="6" aria-selected="false" class="calendar__day-button" tabindex="-1">
            6
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="7" aria-selected="false" class="calendar__day-button" tabindex="-1">
            7
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="8" aria-selected="false" class="calendar__day-button" tabindex="-1">
            8
          </button>
        </td>
      </tr>
      <tr>
        <td class="calendar__day">
          <button aria-label="9" aria-selected="false" class="calendar__day-button" tabindex="-1">
            9
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="10" aria-selected="false" class="calendar__day-button" tabindex="-1">
            10
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="11" aria-selected="false" class="calendar__day-button" tabindex="-1">
            11
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="12" aria-selected="false" class="calendar__day-button" tabindex="-1">
            12
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="13" aria-selected="false" class="calendar__day-button" tabindex="-1">
            13
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="14" aria-selected="false" class="calendar__day-button" tabindex="-1">
            14
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="15" aria-selected="false" class="calendar__day-button" tabindex="-1">
            15
          </button>
        </td>
      </tr>
      <tr>
        <td class="calendar__day">
          <button aria-label="16" aria-selected="false" class="calendar__day-button" tabindex="-1">
            16
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="17" aria-selected="false" class="calendar__day-button" tabindex="-1">
            17
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="18" aria-selected="false" class="calendar__day-button" tabindex="-1">
            18
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="19" aria-selected="false" class="calendar__day-button" tabindex="-1">
            19
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="20" aria-selected="false" class="calendar__day-button" tabindex="-1">
            20
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="21" aria-selected="false" class="calendar__day-button" tabindex="-1">
            21
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="22" aria-selected="false" class="calendar__day-button" tabindex="-1">
            22
          </button>
        </td>
      </tr>
      <tr>
        <td class="calendar__day">
          <button aria-label="23" aria-selected="false" class="calendar__day-button" tabindex="-1">
            23
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="24" aria-selected="false" class="calendar__day-button" tabindex="-1">
            24
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="25" aria-selected="false" class="calendar__day-button" tabindex="-1">
            25
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="26" aria-selected="false" class="calendar__day-button" tabindex="-1">
            26
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="27" aria-selected="false" class="calendar__day-button" tabindex="-1">
            27
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="28" aria-selected="false" class="calendar__day-button" tabindex="-1">
            28
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="29" aria-selected="false" class="calendar__day-button" tabindex="-1">
            29
          </button>
        </td>
      </tr>
      <tr>
        <td class="calendar__day">
          <button aria-label="30" aria-selected="false" class="calendar__day-button" tabindex="-1">
            30
          </button>
        </td>
        <td class="calendar__day">
          <button aria-label="31" aria-selected="false" class="calendar__day-button" tabindex="-1">
            31
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="1"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            1
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="2"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            2
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="3"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            3
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="4"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            4
          </button>
        </td>
        <td class="calendar__day">
          <button
            aria-label="5"
            aria-selected="false"
            class="calendar__day-button"
            tabindex="-1"
            disabled
          >
            5
          </button>
        </td>
      </tr>
    </tbody>
  </table>
`;
