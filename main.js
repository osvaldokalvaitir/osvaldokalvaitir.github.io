fetch("./sections/navbar.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("navbar").innerHTML = data;
  });

fetch("./sections/start.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("start").innerHTML = data;
  });

fetch("./sections/about.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("about").innerHTML = data;
  });

fetch("./sections/experience.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("experience").innerHTML = data;
  });

fetch("./sections/education.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("education").innerHTML = data;
  });

fetch("./sections/skills.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("skills").innerHTML = data;
  });

fetch("./sections/interest.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("interest").innerHTML = data;
  });

fetch("./sections/courses.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("courses").innerHTML = data;
  });

fetch("./sections/speeches.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("speeches").innerHTML = data;
  });

fetch("./sections/thanks.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("thanks").innerHTML = data;
  });